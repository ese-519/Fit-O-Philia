import socket
import matplotlib.pyplot as plt
import json
from pymongo import MongoClient
from datetime import datetime
from drawnow import *
from sys import argv
import thread
import time

target = open('sanjeetTest.txt', 'a')
valuesx = []
valuesy = []
valuesz = []

dumbbellFlag = 0

RHsensorDataRoll = []
RHsensorDataPitch = []

LHsensorDataRoll = []
LHsensorDataPitch = []

RLsensorDataRoll = []
RLsensorDataPitch = []

LLsensorDataRoll = []
LLsensorDataPitch = []

HsensorDataRoll = []
HsensorDataPitch = []

noOfErrors = 0
constantCheck = 0
content = []
pauseFlag=0
videoState = "play"
exercise = ""

plt.ion()
cnt=0
counter=0
prevRollData = 0.0
prevPitchData = 0.0
metaDataFiles = ['hammerCurl.txt', 'singleArm.txt', 'seatedCurl.txt', 'Commercial.txt']
content = []

mutex = thread.allocate_lock()

UDP_IP="10.0.0.126"
UDP_PORT=8888

sockMeteor = socket.socket(socket.AF_INET,
                        socket.SOCK_DGRAM)
sockMeteor.bind((UDP_IP, UDP_PORT))

UDP_PORT = 8887
sockRHPhoton = socket.socket(socket.AF_INET,
                        socket.SOCK_DGRAM)
sockRHPhoton.bind((UDP_IP, UDP_PORT))

UDP_PORT = 8886
sockLHPhoton = socket.socket(socket.AF_INET,
                        socket.SOCK_DGRAM)
sockLHPhoton.bind((UDP_IP, UDP_PORT))

UDP_PORT = 8885
sockRLPhoton = socket.socket(socket.AF_INET,
                        socket.SOCK_DGRAM)
sockRLPhoton.bind((UDP_IP, UDP_PORT))

UDP_PORT = 8884
sockLLPhoton = socket.socket(socket.AF_INET,
                        socket.SOCK_DGRAM)
sockLLPhoton.bind((UDP_IP, UDP_PORT))

UDP_PORT = 8883
sockHPhoton = socket.socket(socket.AF_INET,
                        socket.SOCK_DGRAM)
sockHPhoton.bind((UDP_IP, UDP_PORT))

ch1='A'
ch2='G'

endFlag = 0
timeStamp = 0

def checkConstant():
    prevVal = 0
    counter = 0
    allSameFlag = 0
    for data in RHsensorDataRoll:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)
        print 'counter:', counter
        print 'size', len(RHsensorDataRoll)
    if counter == ((len(RHsensorDataRoll))-1):
        print 'RHroll'
        allSameFlag +=1
    counter = 0
    prevVal = 0

    for data in LHsensorDataRoll:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)
    if counter == len(LHsensorDataRoll)-1:
        print 'LHroll'
        allSameFlag +=1
    counter = 0
    prevVal = 0

    for data in RLsensorDataRoll:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)
    if counter == len(RLsensorDataRoll)-1:
        print 'RLroll'
        allSameFlag +=1
    counter = 0
    prevVal = 0

    for data in LLsensorDataRoll:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)

    if counter == len(LLsensorDataRoll)-1:
        print 'LLroll'
        allSameFlag +=1
    counter = 0
    prevVal = 0

    for data in HsensorDataRoll:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)

    if counter == len(HsensorDataRoll)-1:
        print 'Hroll'
        allSameFlag +=1

    counter = 0
    prevVal = 0

    for data in RHsensorDataPitch:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)

    if counter == len(RHsensorDataPitch)-1:
        print 'RHpitch'
        allSameFlag +=1
    counter = 0
    prevVal = 0

    for data in LHsensorDataPitch:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)

    if counter == len(LHsensorDataPitch)-1:
        print 'LHpitch'
        allSameFlag +=1

    counter = 0
    prevVal = 0

    for data in RLsensorDataPitch:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)

    if counter == len(RLsensorDataPitch)-1:
        print 'RLpitch'
        allSameFlag +=1

    counter = 0
    prevVal = 0

    for data in LLsensorDataPitch:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)

    if counter == len(LLsensorDataPitch)-1:
        print 'LLpitch'
        allSameFlag +=1

    counter = 0
    prevVal = 0

    for data in HsensorDataPitch:
        if(abs(prevVal - float(data)) < 1):
            counter += 1
        prevVal = float(data)

    if counter == len(HsensorDataPitch)-1:
        print 'Hpitch'
        allSameFlag +=1

    counter = 0
    prevVal = 0

    if allSameFlag == 8:
        return 1
    else:
        return 0

def checkDoubleDumbbell(RHrollLow, RHrollHigh, RHpitchLow, RHpitchHigh, LHrollLow, LHrollHigh, LHpitchLow, LHpitchHigh, RLrollLow, RLrollHigh, RLpitchLow, RLpitchHigh, LLrollLow, LLrollHigh, LLpitchLow, LLpitchHigh, HrollLow, HrollHigh, HpitchLow, HpitchHigh):
    global dumbbellFlag
    global pauseFlag
    global prevRollData
    global prevPitchData
    global RHsensorDataRoll
    global RHsensorDataPitch
    global LHsensorDataRoll
    global LHsensorDataPitch
    global RLsensorDataRoll
    global RLsensorDataPitch
    global LLsensorDataRoll
    global LLsensorDataPitch
    global noOfErrors
    global constantCheck
    global videoState

    dumbbellFlag = 1
    start = time.time()
    errorCount = 0
    prevData = 0

    #while (time.time()-start < 30):
    error = 0
    errorFlag = 0
    print "noOfErrors:",noOfErrors, " constantcheck:",constantCheck
    for data in RHsensorDataRoll:
        if((float(data)>RHrollHigh) or (float(data)<RHrollLow)):
            error = 1
            print 'RHroll'
            print 'data', data
            errorFlag = 1
            break

    for data in RHsensorDataPitch:
        if((abs(float(data))<RHpitchLow) or (abs(float(data))>RHpitchHigh)):
            error = 1
            print 'RHpitch'
            print 'data', data
            errorFlag = 1
            break

    if error == 1:
        MeteorSend = 'RH|Wrong'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
        Photon_PORT = 8090
        sockMeteor.sendto(MeteorSend, ("10.0.0.187", Photon_PORT))
    else:
        MeteorSend = 'RH|Correct'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))

    error = 0

    for data in LHsensorDataRoll:
        if((float(data)<LHrollLow) or (float(data)>LHrollHigh)):
            error = 1
            errorFlag = 1
            print 'LHroll'
            print 'data', data
            break
    for data in LHsensorDataPitch:
        if((abs(float(data))<LHpitchLow) or (abs(float(data))>LHpitchHigh)):
            error = 1
            errorFlag = 1
            print 'LHpitch'
            print 'data', data
            break

    if error == 1:
        MeteorSend = 'LH|Wrong'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
        Photon_PORT = 8090
        sockMeteor.sendto(MeteorSend, ("10.0.0.187", Photon_PORT))
    else:
        MeteorSend = 'LH|Correct'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))

    error = 0

    for data in RLsensorDataRoll:
        if((float(data)>RLrollHigh) or (float(data)<RLrollLow)):
            error = 1
            print 'rlroll'
            print 'data', data

            errorFlag = 1
            break

    for data in RLsensorDataPitch:
        if((abs(float(data))<RLpitchLow) or (abs(float(data))>RLpitchHigh)):
            error = 1
            errorFlag = 1
            print 'rlpitch'
            print 'data', data
            break

    if error == 1:
        MeteorSend = 'RL|Wrong'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
        Photon_PORT = 8090
        sockMeteor.sendto(MeteorSend, ("10.0.0.187", Photon_PORT))
    else:
        MeteorSend = 'RL|Correct'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))

    error = 0

    for data in LLsensorDataRoll:
        if((float(data)<LLrollLow) or (float(data)>LLrollHigh)):
            error = 1
            errorFlag = 1
            print 'llroll'
            print 'data', data
            break
            #rightlegError
    for data in LLsensorDataPitch:
        if((abs(float(data))<LLpitchLow) or (abs(float(data))>LLpitchHigh)):
            error = 1
            errorFlag = 1
            print 'llpitch'
            print 'data', data
            break
            #leftLegError

    if error == 1:
        MeteorSend = 'LL|Wrong'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
        Photon_PORT = 8090
        sockMeteor.sendto(MeteorSend, ("10.0.0.187", Photon_PORT))
    else:
        MeteorSend = 'LL|Correct'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
        error = 0
    for data in HsensorDataRoll:
        if((float(data)<HrollLow) or (float(data)>HpitchHigh)):
            error = 1
            errorFlag = 1
            print 'hroll'
            print 'data', data
            break
    for data in HsensorDataPitch:
        if((abs(float(data))<HpitchLow) or (abs(float(data))>HpitchHigh)):
            error = 1
            errorFlag = 1
            print 'hpitch'
            print 'data', data
            break

    if error == 1:
        MeteorSend = 'H|Wrong'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
        Photon_PORT = 8090
        sockMeteor.sendto(MeteorSend, ("10.0.0.187", Photon_PORT))
    else:
        MeteorSend = 'H|Correct'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))

    error = 0

    if(errorFlag == 1):
        noOfErrors+=1

    constCheck = checkConstant()

    if(constCheck == 1):
        constantCheck += 1
    if(constantCheck > 3):
        pauseFlag = 1
        videoState = 'pause'
        MeteorSend = 'pause'
        UDP_PORT = 9997
        constantCheck=0
        noOfErrors=0
        UDP_PORT = 9997
        sockMeteor.sendto(MeteorSend, (UDP_IP, UDP_PORT))
        Pyth_PORT = 9998
        sockMeteor.sendto('pause', (UDP_IP, Pyth_PORT))

    elif(noOfErrors > 6):
        MeteorSend = "switchLow"
        UDP_PORT = 9997
        constantCheck=0
        noOfErrors=0
        sockMeteor.sendto(MeteorSend, (UDP_IP, UDP_PORT))
        MeteorSend = 'F|end'
        Pyth_PORT = 9998
        sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
        return 1

    del RHsensorDataRoll[:]
    del RHsensorDataPitch[:]

    del LHsensorDataRoll[:]
    del LHsensorDataPitch[:]

    del RLsensorDataRoll[:]
    del RLsensorDataPitch[:]
    del RLsensorDataRoll[:]
    del RLsensorDataPitch[:]

    del LLsensorDataRoll[:]
    del LLsensorDataPitch[:]

    del HsensorDataRoll[:]
    del HsensorDataPitch[:]

def recvServer():
  global exercise
  global noOfErrors
  global constantCheck
  global RHsensorDataRoll
  global RHsensorDataPitch
  global LHsensorDataRoll
  global LHsensorDataPitch
  global RLsensorDataRoll
  global RLsensorDataPitch
  global LLsensorDataRoll
  global LLsensorDataPitch
  global HsensorDataRoll
  global HsensorDataPitch
  global endFlag
  global timeStamp
  global prevTimeStamp
  while True:
      data, addr = sockMeteor.recvfrom(1024)
      trimData=data.rstrip(' \t\r\n\0')
      mylist=trimData.split("|")

      if(mylist[0] == 'filename'):
          endFlag=1
          prevTimeStamp = 1000
          print 'endFlag', endFlag
          exercise = mylist[1]
          del RHsensorDataRoll[:]
          del RHsensorDataPitch[:]

          del LHsensorDataRoll[:]
          del LHsensorDataPitch[:]

          del RLsensorDataRoll[:]
          del RLsensorDataPitch[:]

          del RLsensorDataRoll[:]
          del RLsensorDataPitch[:]

          del LLsensorDataRoll[:]
          del LLsensorDataPitch[:]

          del HsensorDataRoll[:]
          del HsensorDataPitch[:]

          noOfErrors=0
          if(exercise == 'dumbbellCurl'):

              MeteorSend = 'F|dumbbellCurl'
              Pyth_PORT = 9998
              sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))

              #checkDoubleDumbbell(-70.0, 50.0, 0.0, 180.0, -70.0, 50.0, 0.0, 180.0, -5.0, 15.0, 70, 110, -5.0, 15.0, 70, 110, -15, 15, 30, 120)
          elif(exercise == 'legLunge'):

              MeteorSend = 'F|legLunge'
              Pyth_PORT = 9998
              sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
              #checkDoubleDumbbell(-30.0, 20.0, 50.0, 120.0, -30.0, 20.0, 50.0, 120.0, -55.0, 35.0, 0, 180, -30.0, 40.0, 70, 110, -30, 30, 0, 150)
          elif(exercise == 'cardio'):

              MeteorSend = 'F|cardio'
              Pyth_PORT = 9998
              sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
              #checkDoubleDumbbell(-30.0, 20.0, 50.0, 120.0, -30.0, 20.0, 50.0, 120.0, -55.0, 35.0, 0, 180, -30.0, 40.0, 70, 110, -50, 50, 0, 150)
          elif(exercise == 'coolDown'):

              MeteorSend = 'F|coolDown'
              Pyth_PORT = 9998
              sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
              #checkDoubleDumbbell(-30.0, 20.0, 50.0, 120.0, -30.0, 20.0, 50.0, 120.0, -55.0, 35.0, 0, 180, -30.0, 40.0, 70, 110, -30, 30, 15, 90)
      elif(mylist[0] == 'num'):
          timeStamp = int(mylist[1])
          if(timeStamp > 3 and timeStamp < 30):
            if(exercise == 'dumbbellCurl'):
              checkDoubleDumbbell(-70.0, 0.0, 70.0, 180.0, -70.0, 70.0, 60.0, 180.0, -5.0, 20.0, 70, 110, -5.0, 20.0, 70, 110, -15, 15, 30, 100)
            elif(exercise == 'legLunge'):
              checkDoubleDumbbell(-30.0, 40.0, 30.0, 120.0, -30.0, 40.0, 50.0, 120.0, -55.0, 35.0, 0, 180, -30.0, 40.0, 50, 180, -30, 30, 0, 120)
            elif(exercise == 'cardio'):
              checkDoubleDumbbell(-60.0, 30.0, 10.0, 160.0, -85.0, 65.0, 0.0, 180.0, -20.0, 20.0, 50, 180, -20.0, 20.0, 60, 180, -50.0, 60.0, 0, 160)
            elif(exercise == 'coolDown'):
              checkDoubleDumbbell(-100.0, 50.0, 0.0, 180.0, -90.0, 90.0, 0.0, 180.0, -70.0, 40.0, 0, 180, -40.0, 40.0, 0, 180, -20, 30, 15, 90)
def recvRHPhoton():
    global pauseFlag
    global videoState
    global RHsensorDataRoll
    global RHsensorDataPitch
    while True:
        data, addr = sockRHPhoton.recvfrom(1024)
        trimData=data.rstrip(' \t\r\n\0')
        print trimData
        if trimData=='play' or trimData=='pause':
          print 'pauseFlag:',pauseFlag
          print 'videoState:', videoState
          if pauseFlag==1:
            UDP_PORT = 9997
            videoState = 'play'
            sockMeteor.sendto('startOver', (UDP_IP, UDP_PORT))
            if(exercise != ''):
                Pyth_PORT = 9998
                sockMeteor.sendto('F|'+exercise, (UDP_IP, Pyth_PORT))
            pauseFlag=0
          elif videoState == 'play':
            UDP_PORT=9997
            videoState = 'pause'
            sockMeteor.sendto('pause', (UDP_IP, UDP_PORT))
            Pyth_PORT = 9998
            sockMeteor.sendto('pause', (UDP_IP, Pyth_PORT))
          elif videoState == 'pause':
            videoState = 'play'
            UDP_PORT=9997
            sockMeteor.sendto('play', (UDP_IP, UDP_PORT))
            Pyth_PORT = 9998
            sockMeteor.sendto('F|'+exercise, (UDP_IP, Pyth_PORT))
        else:
            mylist=trimData.split("|")
            RHsensorDataRoll.append(mylist[1])
            RHsensorDataPitch.append(mylist[2])
        target.write(trimData)
        target.write("\n")

def recvLHPhoton():
    global LHsensorDataRoll
    global LHsensorDataPitch
    while True:
        data, addr = sockLHPhoton.recvfrom(1024)
        trimData=data.rstrip(' \t\r\n\0')
        #print trimData
        mylist=trimData.split("|")
        mutex.acquire()
        LHsensorDataRoll.append(mylist[1])
        LHsensorDataPitch.append(mylist[2])
        mutex.release()
        target.write(trimData)
        target.write("\n")

def recvRLPhoton():
    global RLsensorDataRoll
    global RLsensorDataPitch
    while True:
        data, addr = sockRLPhoton.recvfrom(1024)
        trimData=data.rstrip(' \t\r\n\0')
        #print trimData
        mylist=trimData.split("|")
        mutex.acquire()
        RLsensorDataRoll.append(mylist[1])
        RLsensorDataPitch.append(mylist[2])
        mutex.release()
        target.write(trimData)
        target.write("\n")

def recvLLPhoton():
    global LLsensorDataRoll
    global LLsensorDataPitch
    while True:
        data, addr = sockLLPhoton.recvfrom(1024)
        trimData=data.rstrip(' \t\r\n\0')
        #print trimData
        mylist=trimData.split("|")
        mutex.acquire()
        LLsensorDataRoll.append(mylist[1])
        LLsensorDataPitch.append(mylist[2])
        mutex.release()
        target.write(trimData)
        target.write("\n")

def recvHPhoton():
    global HsensorDataRoll
    global HsensorDataPitch
    while True:
        data, addr = sockHPhoton.recvfrom(1024)
        trimData=data.rstrip(' \t\r\n\0')
        #print trimData
        mylist=trimData.split("|")
        mutex.acquire()
        HsensorDataRoll.append(mylist[1])
        HsensorDataPitch.append(mylist[2])
        mutex.release()
        target.write(trimData)
        target.write("\n")

def monitorThread():
    global timeStamp,endFlag
    global prevTimeStamp
    prevTimeStamp = 1000
    while True:
        print "timeStamp",timeStamp
        print "prevTimeStamp",prevTimeStamp
        if(endFlag == 1 and prevTimeStamp == timeStamp):
            endFlag = 0
            MeteorSend = 'F|end'
            Pyth_PORT = 9998
            sockMeteor.sendto(MeteorSend, (UDP_IP, Pyth_PORT))
        prevTimeStamp = timeStamp
        time.sleep(2)
        
try:
  target.write("\n");
  thread.start_new_thread( recvRHPhoton, ( ))
  thread.start_new_thread( recvLHPhoton, ( ))
  thread.start_new_thread( recvLLPhoton, ( ))
  thread.start_new_thread( recvRLPhoton, ( ))
  thread.start_new_thread( recvHPhoton, ( ))
  thread.start_new_thread( recvServer, ( ))
  thread.start_new_thread( monitorThread, ( ))
except:
  print "Error: unable to start thread"

while 1:
  pass
