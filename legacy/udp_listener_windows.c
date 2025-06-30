#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdio.h>
#include <stdlib.h>

#pragma comment(lib, "ws2_32.lib")  // Link Winsock library

#define LISTEN_PORT 4210
#define BUFFER_SIZE 8192

int main() {
    WSADATA wsaData;
    SOCKET sock;
    struct sockaddr_in serverAddr, clientAddr;
    char buffer[BUFFER_SIZE];
    int clientAddrLen = sizeof(clientAddr);

    // Initialize Winsock
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        printf("WSAStartup failed.\n");
        return 1;
    }

    // Create socket
    sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock == INVALID_SOCKET) {
        printf("Socket creation failed.\n");
        WSACleanup();
        return 1;
    }

    // Bind socket
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(LISTEN_PORT);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    if (bind(sock, (SOCKADDR*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        printf("Bind failed.\n");
        closesocket(sock);
        WSACleanup();
        return 1;
    }

    printf("Listening for UDP packets on port %d...\n\n", LISTEN_PORT);

    while (1) {
        int bytesReceived = recvfrom(sock, buffer, BUFFER_SIZE - 1, 0,
                                     (SOCKADDR*)&clientAddr, &clientAddrLen);

        if (bytesReceived == SOCKET_ERROR) {
            printf("recvfrom failed.\n");
            break;
        }

        buffer[bytesReceived] = '\0';
        printf("From %s: %s\n", inet_ntoa(clientAddr.sin_addr), buffer);
    }

    closesocket(sock);
    WSACleanup();
    return 0;
}
