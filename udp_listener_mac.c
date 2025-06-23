// gcc udp_listener_macos.c -o udp_listener
//./udp_listener
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>           // for close()
#include <arpa/inet.h>        // for inet_ntoa()
#include <sys/socket.h>
#include <netinet/in.h>

#define LISTEN_PORT 4210
#define BUFFER_SIZE 8192

int main() {
    int sockfd;
    struct sockaddr_in serverAddr, clientAddr;
    socklen_t clientAddrLen = sizeof(clientAddr);
    char buffer[BUFFER_SIZE];

    // Create UDP socket
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("❌ Socket creation failed");
        exit(EXIT_FAILURE);
    }

    // Bind the socket to a port
    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(LISTEN_PORT);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    if (bind(sockfd, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        perror("❌ Bind failed");
        close(sockfd);
        exit(EXIT_FAILURE);
    }

    printf("✅ Listening for UDP packets on port %d...\n\n", LISTEN_PORT);

    while (1) {
        ssize_t bytesReceived = recvfrom(sockfd, buffer, BUFFER_SIZE - 1, 0,
                                         (struct sockaddr*)&clientAddr, &clientAddrLen);

        if (bytesReceived < 0) {
            perror("❌ recvfrom failed");
            break;
        }

        buffer[bytesReceived] = '\0';
        printf("From %s: %s\n", inet_ntoa(clientAddr.sin_addr), buffer);
    }

    close(sockfd);
    return 0;
}
