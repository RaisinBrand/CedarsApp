#include <WiFi.h>
#include <WiFiClient.h>
#include <time.h>

const char* ssid       = "Kite";
const char* password   = "mgltx3d94pw8";

// const char* host       = "172.20.10.9";  // Arduino IP 
const char* host       = "172.20.10.5";  // your laptop IP
const int   hostPort   = 4210;

WiFiClient tcpClient;

void connectWifi() {
  WiFi.begin(ssid, password);
  Serial.print("⏳ Connecting to WiFi");
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(500);
    Serial.print(".");
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected!");
  } else {
    Serial.println("\n❌ WiFi failed");
    while(true) delay(1000);
  }
}

void connectTCP() {
  if (tcpClient.connected()) {
  Serial.println("🎉 Initial TCP connection succeeded!");
}
  if (tcpClient.connected()) return;
  Serial.print("⏳ Connecting to TCP ");
  if (tcpClient.connect(host, hostPort)) {
    Serial.println("✅");
  } else {
    Serial.println("❌");
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(86, OUTPUT);
  srand(time(NULL));
  connectWifi();
  Serial.print("✅ Wi-Fi up. My IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("➡️ Will connect to ");
  Serial.print(host);
  Serial.print(":");
  Serial.println(hostPort);
  connectTCP();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWifi();
    connectTCP();
  }
  if (!tcpClient.connected()) {
    connectTCP();
    delay(100);
    return;
  }

  const int size = 40;
  uint8_t buffer[size];
  for (int i = 0; i < size; i++) {
    buffer[i] = random(0, 256);
  }

  digitalWrite(86, HIGH);
  size_t sent = tcpClient.write(buffer, size);
  tcpClient.flush();
  digitalWrite(86, LOW);

  // <-- fixed here -->
  Serial.print("Sent ");
  Serial.print(sent);
  Serial.println(" bytes over TCP");

  delay(500);
}
