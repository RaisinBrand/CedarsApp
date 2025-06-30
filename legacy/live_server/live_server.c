// gcc udp_listener_mac.c mongoose.c -o udp_listener -lpthread
#include "mongoose.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>    // for close()
#include <arpa/inet.h> // for inet_ntoa()
#include <sys/socket.h>
#include <netinet/in.h>
#include <pthread.h>

#define LISTEN_PORT 4210
#define BUFFER_SIZE 8192
#define HTTP_PORT "8080"

int32_t latest_values[10] = {0};
pthread_mutex_t data_mutex = PTHREAD_MUTEX_INITIALIZER;

void *udp_thread_func(void *arg)
{
    int sockfd;
    struct sockaddr_in serverAddr, clientAddr;
    socklen_t clientAddrLen = sizeof(clientAddr);
    char buffer[BUFFER_SIZE];

    // Create UDP socket
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0)
    {
        perror("Socket creation failed");
        return NULL;
    }

    // Bind the socket to a port
    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(LISTEN_PORT);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    if (bind(sockfd, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) < 0)
    {
        perror("Bind failed");
        close(sockfd);
        return NULL;
    }

    printf("Listening for UDP packets on port %d...\n\n", LISTEN_PORT);

    while (1)
    {
        ssize_t bytesReceived = recvfrom(sockfd, buffer, BUFFER_SIZE - 1, 0,
                                         (struct sockaddr *)&clientAddr, &clientAddrLen);

        if (bytesReceived < 0)
        {
            perror("recvfrom failed");
            break;
        }

        buffer[bytesReceived] = '\0';
        printf("[UDP] From %s: received %zd bytes\n", inet_ntoa(clientAddr.sin_addr), bytesReceived);
        printf("[UDP] Raw bytes: ");
        for (int i = 0; i < bytesReceived; i++)
            printf("%02X ", (unsigned char)buffer[i]);
        printf("\n");

        if (bytesReceived == 40)
        {
            int32_t values[10];
            memcpy(values, buffer, 40);
            pthread_mutex_lock(&data_mutex);
            memcpy(latest_values, values, sizeof(latest_values));
            pthread_mutex_unlock(&data_mutex);
            printf("[UDP] ✅ SUCCESS: Interpreted as 10 ints: ");
            for (int i = 0; i < 10; i++)
                printf("%d ", values[i]);
            printf("\n");
            printf("[UDP] ✅ Packet stored in latest_values array\n");
        }
        else
        {
            printf("[UDP] ⚠️  WARNING: Packet not 40 bytes (%zd bytes), ignoring for /emg\n", bytesReceived);
        }
    }

    close(sockfd);
    return NULL;
}

static void http_fn(struct mg_connection *c, int ev, void *ev_data)
{
    if (ev == MG_EV_HTTP_MSG)
    {
        struct mg_http_message *hm = (struct mg_http_message *)ev_data;
        if (mg_strcmp(hm->uri, mg_str("/emg")) == 0)
        {
            char json[256] = "[";
            pthread_mutex_lock(&data_mutex);
            for (int i = 0; i < 10; i++)
            {
                char num[32];
                snprintf(num, sizeof(num), "%d", latest_values[i]);
                strcat(json, num);
                if (i < 9)
                    strcat(json, ",");
            }
            pthread_mutex_unlock(&data_mutex);
            strcat(json, "]\n");
            mg_http_reply(c, 200, "Content-Type: application/json\r\n", "%s", json);
        }
        else
        {
            mg_http_reply(c, 404, "Content-Type: text/plain\r\n", "Not found\n");
        }
    }
}

int main()
{
    pthread_t udp_thread;
    if (pthread_create(&udp_thread, NULL, udp_thread_func, NULL) != 0)
    {
        fprintf(stderr, "Failed to create UDP thread\n");
        return 1;
    }

    struct mg_mgr mgr;
    mg_mgr_init(&mgr);
    if (mg_http_listen(&mgr, "http://0.0.0.0:8080", http_fn, NULL) == NULL)
    {
        fprintf(stderr, "Failed to start HTTP server on port 8080\n");
        return 1;
    }
    printf("HTTP server running on port 8080\n");

    for (;;)
        mg_mgr_poll(&mgr, 1000);
    mg_mgr_free(&mgr);
    return 0;
}