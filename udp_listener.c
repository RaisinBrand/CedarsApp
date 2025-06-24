// gcc udp_listener.c mongoose.c -o udp_listener -lpthread
#include "mongoose.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <arpa/inet.h>
#include <unistd.h>

#define UDP_PORT 5005
#define HTTP_PORT "8080"
#define MAX_POINTS 100

double emg_data[MAX_POINTS];
int emg_count = 0;
pthread_mutex_t data_mutex = PTHREAD_MUTEX_INITIALIZER;

// UDP listener thread
void *udp_thread_func(void *arg)
{
    int sockfd;
    struct sockaddr_in addr;
    char buf[256];

    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(UDP_PORT);
    bind(sockfd, (struct sockaddr *)&addr, sizeof(addr));

    while (1)
    {
        int len = recv(sockfd, buf, sizeof(buf) - 1, 0);
        if (len > 0)
        {
            buf[len] = '\0';
            double v = atof(buf);
            printf("Received UDP: '%s' (parsed: %f)\n", buf, v);
            pthread_mutex_lock(&data_mutex);
            if (emg_count < MAX_POINTS)
            {
                emg_data[emg_count++] = v;
            }
            else
            {
                memmove(emg_data, emg_data + 1, (MAX_POINTS - 1) * sizeof(double));
                emg_data[MAX_POINTS - 1] = v;
            }
            pthread_mutex_unlock(&data_mutex);
        }
    }
    close(sockfd);
    return NULL;
}

// HTTP event handler
static void fn(struct mg_connection *c, int ev, void *ev_data, void *fn_data)
{
    if (ev == MG_EV_HTTP_MSG)
    {
        struct mg_http_message *hm = (struct mg_http_message *)ev_data;
        if (mg_strcmp(hm->uri, mg_str("/emg")) == 0)
        {
            char json[4096] = "[";
            pthread_mutex_lock(&data_mutex);
            for (int i = 0; i < emg_count; i++)
            {
                char num[32];
                snprintf(num, sizeof(num), "%.2f", emg_data[i]);
                strcat(json, num);
                if (i < emg_count - 1)
                    strcat(json, ",");
            }
            pthread_mutex_unlock(&data_mutex);
            strcat(json, "]");
            mg_http_reply(c, 200, "Content-Type: application/json\r\n", "%s\n", json);
        }
        else
        {
            mg_http_reply(c, 404, "", "Not found\n");
        }
    }
}

int main()
{
    pthread_t udp_thread;
    pthread_create(&udp_thread, NULL, udp_thread_func, NULL);

    struct mg_mgr mgr;
    mg_mgr_init(&mgr);
    mg_http_listen(&mgr, "http://0.0.0.0:" HTTP_PORT, fn, NULL);

    printf("UDP listener on port %d, HTTP server on port %s\n", UDP_PORT, HTTP_PORT);
    for (;;)
        mg_mgr_poll(&mgr, 1000);

    mg_mgr_free(&mgr);
    return 0;
}
