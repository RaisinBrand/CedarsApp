#include <WiFi.h>
#include <WiFiUDP.h>
#include <time.h>



const char* ssid = "Kite";
const char* password = "mgltx3d94pw8";

const char* host = "172.20.10.15";  // Laptop IP
const int hostPort = 4210;
const int localPort = 2390;  // Port Arduino uses to send from
int myInt = 0;
String message = ".";



WiFiUDP udp;

void connectWifi() {
  WiFi.begin(ssid, password);
  Serial.println("\nConnecting");

  unsigned long startAttemptTime = millis();
  const unsigned long timeout = 15000;        // 15 seconds

  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < timeout) {
    delay(500);
    Serial.print(".");
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    udp.begin(localPort);
  } else {
    Serial.println("\nWiFi connection failed after 15 seconds.");
    exit(0);
  }
}

void setup() {
  Serial.begin(115200);
  srand(time(NULL));  // Seed once at startup
  connectWifi();
}


void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWifi();

  // Seed only once — move to setup() ideally, not in loop


  
  double min = 1.0001;
  double max = 1.001;

  double r = ((double)rand() / RAND_MAX) * (max - min) + min;


// note each byte is a sample, is the assumption 
// if adc res is 16 bit, thne we can assume 2 bytes per sample 
// if adc res is 8 bit, then we can assume 1 byte per sample 
// size = 40
// 2 bytes per sample, size 40 means we have 20 samples per packet 
// 1 byte per sample, size 40 means we have 40 samples per packet 

// this is just int size / samples per packet, where samples per packet depends on adc res
// note: giga r1 has 16 bit adc res at the maximum 

  int size = 40; // defines your packet size (bytes); 40 samples per packet
  char buffer[size];
  for(int i = 0; i < size; i++){
    buffer[i] = random(0,256); 
  }

  // Convert r to String with 6 decimal places
  //message = String(r, 6);

  digitalWrite(86, HIGH);
  udp.beginPacket(host, hostPort);
  udp.write((uint8_t*)buffer, 40);
  udp.endPacket();

  Serial.println("Sent UDP packet: ");
  digitalWrite(86, LOW); 
  delay(500); // two packets per second calcualted by 1 sec / 500 ms = 2 packets/sec 

}