// This #include statement was automatically added by the Particle IDE.
#include "Particle.h"
#include "Adafruit_10DOF_IMU/Adafruit_10DOF_IMU.h"

/* Assign a unique ID to the sensors */
Adafruit_10DOF                dof   = Adafruit_10DOF();
Adafruit_LSM303_Accel_Unified accel = Adafruit_LSM303_Accel_Unified(30301);

/**************************************************************************/
/*!
    @brief  Initialises all the sensors used by this example
*/
/**************************************************************************/

unsigned int localPort = 8090;
UDP Udp;
const size_t bufferSize = 10;
char buffer[bufferSize];
int port=8883;
int pyPort=9990;
int val=0;
int prevVal=0;
int button = D6;
int vibrate = D5;
int valISR = 0;

long recordTime = 0;
long prevTime = 0;
int state = 0;
long startTime = 0;
long vibStart = 0;
int vibState = 0;

void initSensors()
{
  if(!accel.begin())
  {
    /* There was a problem detecting the LSM303 ... check your connections */
    Serial.println(F("Ooops, no LSM303 detected ... Check your wiring!"));
  }
}

/**************************************************************************/
/*!
*/
/**************************************************************************/
void setup(void)
{
  Serial.begin(115200);
  Serial.println(F("Adafruit 10 DOF Pitch/Roll/Heading Example")); Serial.println("");
  Udp.begin(localPort);
  pinMode(button, INPUT_PULLUP);
  
  pinMode(vibrate, OUTPUT);
  
  attachInterrupt(button, ISR, FALLING);
  Serial.println(WiFi.localIP());
  /* Initialise the sensors */
  initSensors();
  startTime = Time.now();
}

/**************************************************************************/
/*!
    @brief  Constantly check the roll/pitch/heading/altitude/temperature
*/
/**************************************************************************/
void loop(void)
{
  sensors_event_t accel_event;
  sensors_vec_t   orientation;
  Serial.println(WiFi.localIP());
  IPAddress remoteIP(10,0,0,126);
  if(vibState == 1){
      if(Time.now() - vibStart > 2){
        vibState = 0;
        digitalWrite(vibrate, LOW);
      }
  }
  if(valISR == 1){
     if(state == 0 && Time.now()-prevTime>2){
            Serial.println("play");
            String play = "play";
            state = 1;
            prevTime = Time.now();
            Udp.beginPacket(remoteIP, port);
            Udp.write(play);
            Udp.endPacket();
        } else if(Time.now()-prevTime>2){
            Serial.println("pause");
            String pause = "pause";
            state = 0;
            prevTime = Time.now();
            Udp.beginPacket(remoteIP, port);
            Udp.write(pause);
            Udp.endPacket();
        }
        valISR = 0;
  }
  else
   {
       
    if (Udp.parsePacket() > 0)
    {
        Serial.println("received");
        int i = Udp.read();
        vibStart = Time.now();
        vibState = 1;
        digitalWrite(vibrate, HIGH);
        Udp.flush();
    }
    
    accel.getEvent(&accel_event);
    if (dof.accelGetOrientation(&accel_event, &orientation))
     {
    /* 'orientation' should have valid .roll and .pitch fields */
    //Serial.print(F("Roll: "));
   
    String roll=(String)orientation.roll;
   
    String pitch=(String)orientation.pitch;
    //Serial.print(pitch);
    //Serial.print(F("; "));
    
     Serial.print("H|"+roll+"|"+pitch);
     Udp.beginPacket(remoteIP, port);
     Udp.write("HG|" + roll+"|"+pitch);
     Udp.endPacket();
     
     Udp.beginPacket(remoteIP, pyPort);
     Udp.write("HG|" + roll+"|"+pitch);
     Udp.endPacket();
    }
  }
  /* Calculate the heading using the magnetometer */
  Serial.println(F(""));
  delay(500);
  //}
}




void ISR(void) 
{
  valISR = 1;
}