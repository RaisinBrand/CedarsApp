#include <SPI.h>
#include <WiFi.h>

// ── Wi-Fi credentials ────────────────────────────────
char ssid[] = "Kite";            // hotspot SSID
char pass[] = "mgltx3d94pw8";    // hotspot password

// ── Backend “hello” target ───────────────────────────
IPAddress SERVER_IP(172, 20, 10, 5); // ← CHANGE to your laptop’s IP
const uint16_t HELLO_PORT = 4210;    // same port FastAPI listens on

// ── Globals ──────────────────────────────────────────
int status   = WL_IDLE_STATUS;
unsigned long lastHello   = 0;   // ms timestamp for 5-s beacon
unsigned long lastStats   = 0;   // ms timestamp for 10-s Wi-Fi stats

// ── Forward decls for your helpers ───────────────────
void printCurrentNet();
void printWifiData();
void printMacAddress(byte mac[]);

void setup() {
  Serial.begin(9600);
  while (!Serial) { }                     // wait for USB CDC

  // Check Wi-Fi module present
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true);
  }

  // Connect to hotspot
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(10000);                         // wait 10 s
  }

  Serial.println("You're connected to the network");
  printCurrentNet();
  printWifiData();
}

void loop() {
  unsigned long now = millis();

  /* ── 1️⃣  Send 5-s TCP hello ─────────────── */
  if (now - lastHello >= 5000) {
    lastHello = now;

    WiFiClient client;
    if (client.connect(SERVER_IP, HELLO_PORT)) {
      client.print("{\"id\":\"giga-01\",\"type\":\"hello\"}");
      client.stop();                      // fire-and-forget
    } else {
      Serial.println("⚠️  Hello connect failed");
    }
  }

  /* ── 2️⃣  Print Wi-Fi stats every 10 s ───── */
  if (now - lastStats >= 10000) {
    lastStats = now;
    printCurrentNet();
  }

  /*  …later: push real sensor frames here …   */
}

/* ── Your original helper fns (unchanged) ────────── */
void printWifiData() {
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: "); Serial.println(ip);

  byte mac[6]; WiFi.macAddress(mac);
  Serial.print("MAC address: "); printMacAddress(mac);
}

void printCurrentNet() {
  Serial.print("SSID: "); Serial.println(WiFi.SSID());

  byte bssid[6]; WiFi.BSSID(bssid);
  Serial.print("BSSID: "); printMacAddress(bssid);

  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):"); Serial.println(rssi);

  byte encryption = WiFi.encryptionType();
  Serial.print("Encryption Type:"); Serial.println(encryption, HEX);
  Serial.println();
}

void printMacAddress(byte mac[]) {
  for (int i = 5; i >= 0; i--) {
    if (mac[i] < 16) Serial.print("0");
    Serial.print(mac[i], HEX);
    if (i > 0) Serial.print(":");
  }
  Serial.println();
}
