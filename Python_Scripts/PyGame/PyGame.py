import pylab
import socket
import thread
from pylab import *


values1 = [0 for x in range(100)]
values2 = [0 for x in range(100)]
values3 = [0 for x in range(100)]
values4 = [0 for x in range(100)]
values5 = [0 for x in range(100)]
values6 = [0 for x in range(100)]
values7 = [0 for x in range(100)]
values8 = [0 for x in range(100)]
values9 = [0 for x in range(100)]
values10 = [0 for x in range(100)]

UDP_IP = "10.0.0.126"
UDP_PORT = 9990
sockGraph = socket.socket(socket.AF_INET,
                          socket.SOCK_DGRAM)
sockGraph.bind((UDP_IP, UDP_PORT))

UDP_IP_STICK = "10.0.0.126"
UDP_PORT_STICK = 9998

sockStick = socket.socket(socket.AF_INET,
                          socket.SOCK_DGRAM)
sockStick.bind((UDP_IP_STICK, UDP_PORT_STICK))


xAchse=pylab.arange(0,100,1)
yAchse=pylab.array([0]*100)

fig = pylab.figure(1)

ax1 = fig.add_subplot(151)
ax1.grid(True)
ax1.set_title("RHG")
ax1.set_xlabel("Time")
ax1.set_ylabel("Amplitude")
line1=ax1.plot(xAchse,yAchse,'-')
line2=ax1.plot(xAchse,yAchse,'-')


ax2 = fig.add_subplot(152)
ax2.grid(True)
ax2.set_title("LHG")
ax2.set_xlabel("Time")
line3=ax2.plot(xAchse,yAchse,'-')
line4=ax2.plot(xAchse,yAchse,'-')


ax3 = fig.add_subplot(153)
ax3.grid(True)
ax3.set_title("RLG")
ax3.set_xlabel("Time")
line5=ax3.plot(xAchse,yAchse,'-')
line6=ax3.plot(xAchse,yAchse,'-')

ax4 = fig.add_subplot(154)
ax4.grid(True)
ax4.set_title("LLG")
ax4.set_xlabel("Time")
line7=ax4.plot(xAchse,yAchse,'-')
line8=ax4.plot(xAchse,yAchse,'-')


ax5 = fig.add_subplot(155)
ax5.grid(True)
ax5.set_title("HG")
ax5.set_xlabel("Time")
line9=ax5.plot(xAchse,yAchse,'-')
line10=ax5.plot(xAchse,yAchse,'-')


def receive():
  global values1, values2
  while True:
    data, addr = sockGraph.recvfrom(1024)
    trimData = data.rstrip(' \t\r\n\0')
    #print trimData
    myList = trimData.split("|")
    if myList[0] == "RHG":
      values1.append(float(myList[1]))
      values2.append(float(myList[2]))
    elif myList[0] == "LHG":
      values3.append(float(myList[1]))
      values4.append(float(myList[2]))
    elif myList[0] == "RLG":
      values5.append(float(myList[1]))
      values6.append(float(myList[2]))
    elif myList[0] == "LLG":
      values7.append(float(myList[1]))
      values8.append(float(myList[2]))
    elif myList[0] == "HG":
      values9.append(float(myList[1]))
      values10.append(float(myList[2]))

def RealtimePloter(arg):
  global values1, values2
  CurrentXAxis=pylab.arange(len(values1)-100,len(values1),1)
  
  line1[0].set_data(CurrentXAxis,pylab.array(values1[-100:]))
  line2[0].set_data(CurrentXAxis,pylab.array(values2[-100:]))
  line3[0].set_data(CurrentXAxis,pylab.array(values3[-100:]))
  line4[0].set_data(CurrentXAxis,pylab.array(values4[-100:]))
  line5[0].set_data(CurrentXAxis,pylab.array(values5[-100:]))
  line6[0].set_data(CurrentXAxis,pylab.array(values6[-100:]))
  line7[0].set_data(CurrentXAxis,pylab.array(values7[-100:]))
  line8[0].set_data(CurrentXAxis,pylab.array(values8[-100:]))
  line9[0].set_data(CurrentXAxis,pylab.array(values9[-100:]))
  line10[0].set_data(CurrentXAxis,pylab.array(values10[-100:]))



  ax1.axis([CurrentXAxis.min(),CurrentXAxis.max(),min(min(values1),min(values2)),max(max(values1),max(values2))])
  ax2.axis([CurrentXAxis.min(),CurrentXAxis.max(),min(min(values3),min(values4)),max(max(values3),max(values4))])
  ax3.axis([CurrentXAxis.min(),CurrentXAxis.max(),min(min(values5),min(values6)),max(max(values5),max(values6))])
  ax4.axis([CurrentXAxis.min(),CurrentXAxis.max(),min(min(values7),min(values8)),max(max(values7),max(values8))])
  ax5.axis([CurrentXAxis.min(),CurrentXAxis.max(),min(min(values9),min(values10)),max(max(values9),max(values10))])

  manager.canvas.draw()

manager = pylab.get_current_fig_manager()

#values=[]

import pygame
from pygame.locals import *
import time
import matplotlib
matplotlib.use("Agg")
import matplotlib.backends.backend_agg as agg 
import pylab



# Define some colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
pos = 0
Lhy=300
Rhy=300
Lly=300
Rly=300

LH = 0
RH = 0
LL = 0
RL = 0

C_LH = C_RH = BLACK
C_LL = BLACK
C_RL = GREEN
C_RL1 = BLACK
C_H = BLACK



def draw_stick_figure(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    # Head
    pygame.draw.ellipse(screen, C_H, [x-35, y-250, 90, 90], 5)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, 17 + y], [100 + x, 137 + lly], 5)
    pygame.draw.line(screen, C_RL1, [5 + x, 17 + y], [x-80, 127 + rly], 5)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x, 17 + y], [5 + x, y-160], 5)

    # Arms
    #upper
    pygame.draw.line(screen, C_LH, [5 + x, y-140], [30 + x, y-70], 5)#right
    pygame.draw.line(screen, C_RH, [5 + x, y-140], [x-20, y-70], 5)#left
    #lower
    pygame.draw.line(screen, C_LH, [30 + x, y-70], [60 + x, lhy-20], 5)
    pygame.draw.line(screen, C_RH, [x-20, y-70], [x-50, rhy-20], 5)


def LHup():
    global LH, Lhy
    Lhy = 200
    LH += 1
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
def RHup():
    global RH, Rhy
    Rhy = 200
    RH += 1
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def RLHup():
    global RH, LH, Lhy, Rhy
    RH += 1
    LH += 1
    Lhy = 200
    Rhy = 200
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def LHdown():
    global Lhy
    Lhy = 300
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
def RHDown():
    global Rhy
    Rhy = 300
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def RLUp():
    global RL, Rly
    Rly = 200
    RL += 1
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def LLup():
    global LL, Lly
    Lly = 200
    LL += 1
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def RLup():
    global RL, Rly
    Rly = 200
    RL += 1
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def RLDown():
    global Rly
    Rly = 300
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def LLDown():
    global Lly
    Lly = 300
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def RLBothDown():
    global Rly, Lly
    Rly = 300
    Lly = 300
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def normal():
    global Lhy, Rhy, Lly, Rly
    #print "in normal"
    Lhy = Rhy = Lly = Rly = 300
    pygame.display.flip()
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def draw_init(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))  

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-250, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x, 137 + y], [5 + x, y-160], 6)

def draw_ll1(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))    

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-230, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y], [5 + x, y-140], 6)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y], [30 + x, 80 + lly], 6)
    pygame.draw.line(screen, C_LL, [70 + x, 137+y], [30 + x, 80 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y], [x-35, 80 + rly], 6)
    pygame.draw.line(screen, C_RL, [x-50, 137+y], [x-35, 80 + rly], 6)

def draw_ll2(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-210, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+20], [5 + x, y-120], 6)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y+20], [30 + x, 100 + lly], 6)
    pygame.draw.line(screen, C_LL, [90 + x, 137+y], [30 + x, 100 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y+20], [x-70, 80 + rly], 6)
    pygame.draw.line(screen, C_RL, [x-65, 137+y], [x-70, 80 + rly], 6)

def draw_ll3(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))  

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-190, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [15 + x, 120 + lly], 6)
    pygame.draw.line(screen, C_LL, [90 + x, 137+y], [15 + x, 120 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [x-70, 80 + rly], 6)
    pygame.draw.line(screen, C_RL, [x-55, 137+y], [x-70, 80 + rly], 6)

def draw_rl1(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))  

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-230, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y], [5 + x, y-140], 6)

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y], [30 + x, 80 + lly], 6)
    pygame.draw.line(screen, C_RL, [70 + x, 137+y], [30 + x, 80 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y], [x-35, 80 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-50, 137+y], [x-35, 80 + rly], 6)

def draw_rl2(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-210, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+20], [5 + x, y-120], 6)

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y+20], [30 + x, 100 + lly], 6)
    pygame.draw.line(screen, C_RL, [90 + x, 137+y], [30 + x, 100 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y+20], [x-70, 80 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-65, 137+y], [x-70, 80 + rly], 6)

def draw_rl3(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-190, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [15 + x, 120 + lly], 6)
    pygame.draw.line(screen, C_RL, [90 + x, 137+y], [15 + x, 120 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-70, 80 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-55, 137+y], [x-70, 80 + rly], 6)

def ll():
    #print "in ll"
    screen.fill(WHITE)
    draw_init(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)
    
    screen.fill(WHITE)
    draw_ll1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)
    
    screen.fill(WHITE)
    draw_ll2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_ll3(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_ll2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_ll1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

def rl():
    #print "in rl"
    screen.fill(WHITE)
    draw_init(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)
    
    screen.fill(WHITE)
    draw_rl1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)
    
    screen.fill(WHITE)
    draw_rl2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_rl3(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_rl2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_rl1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)   

def draw_head1(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-250, 90, 90], 2)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, 17 + y], [100 + x, 137 + lly], 6)
    pygame.draw.line(screen, C_RL1, [5 + x, 17 + y], [x-80, 127 + rly], 6)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x, 17 + y], [5 + x, y-160], 6)

    # Arms
    #upper
    pygame.draw.line(screen, C_LH, [5 + x, y-100], [70 + x, y-70], 6)#right
    pygame.draw.line(screen, C_RH, [5 + x, y-100], [x-60, y-70], 6)#left
    #lower
    pygame.draw.line(screen, C_LH, [10 + x, y-50], [70 + x, y-70], 6)
    pygame.draw.line(screen, C_RH, [x-60, y-70], [x, y-50], 6)

def draw_head2(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300


    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-100, y-231, 90, 90], 2)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, 17 + y], [100 + x, 137 + lly], 6)
    pygame.draw.line(screen, C_RL1, [5 + x, 17 + y], [x-80, 127 + rly], 6)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x, 17 + y], [x-20, y-160], 6)

    # Arms
    #upper
    pygame.draw.line(screen, C_LH, [x-10, y-100], [50 + x, y-85], 6)#right
    pygame.draw.line(screen, C_RH, [x-10, y-100], [x-65, y-65], 6)#left
    #lower
    pygame.draw.line(screen, C_LH, [x, y-55], [50 + x, y-85], 6)
    pygame.draw.line(screen, C_RH, [x-65, y-65], [x-10, y-55], 6)

def draw_head3(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-220, 90, 90], 2)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, 17 + y], [100 + x, 137 + lly], 6)
    pygame.draw.line(screen, C_RL1, [5 + x, 17 + y], [x-80, 127 + rly], 6)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x, 17 + y], [5 + x, y-130], 6)

    # Arms
    #upper
    pygame.draw.line(screen, C_LH, [5 + x, y-90], [70 + x, y-70], 6)#right
    pygame.draw.line(screen, C_RH, [5 + x, y-90], [x-60, y-70], 6)#left
    #lower
    pygame.draw.line(screen, C_LH, [10 + x, y-45], [70 + x, y-70], 6)
    pygame.draw.line(screen, C_RH, [x-60, y-70], [x, y-45], 6)


def draw_head4(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300


    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x+15, y-237, 90, 90], 2)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, 17 + y], [100 + x, 137 + lly], 6)
    pygame.draw.line(screen, C_RL1, [5 + x, 17 + y], [x-80, 127 + rly], 6)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x, 17 + y], [30 + x, y-160], 6)

    # Arms
    #upper
    pygame.draw.line(screen, C_LH, [25 + x, y-95], [80 + x, y-65], 6)#right
    pygame.draw.line(screen, C_RH, [20 + x, y-95], [x-40, y-75], 6)#left
    #lower
    pygame.draw.line(screen, C_LH, [20 + x, y-55], [80 + x, y-65], 6)
    pygame.draw.line(screen, C_RH, [x-40, y-75], [x+10, y-60], 6)

def headMoving():
    screen.fill(WHITE)
    draw_head1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(1)
    

    screen.fill(WHITE)
    draw_head2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(1)
    

    screen.fill(WHITE)
    draw_head3(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(1)

    screen.fill(WHITE)
    draw_head4(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(1)

def draw_bal_init(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))  

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-250, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x, 137 + y], [5 + x, y-160], 6)

def draw_bal_rl1(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-190, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, C_RH, [5 + x, y-60], [x-20, y-30], 6)
    pygame.draw.line(screen, C_LH, [5 + x, y-75], [x-20, y-35], 6)
    

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [15 + x, 100 + lly], 6)
    pygame.draw.line(screen, C_RL, [40 + x, 97+y], [15 + x, 100 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-10, 50 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-20, 137+y], [x-10, 50 + rly], 6)

def draw_bal_rl2(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-45, y-188, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, C_RH, [5 + x, y-60], [x-60, y-35], 6)
    pygame.draw.line(screen, C_LH, [5 + x, y-70], [x-60, y-35], 6)
    

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [15 + x, 100 + lly], 6)
    pygame.draw.line(screen, C_RL, [40 + x, 97+y], [15 + x, 100 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-10, 50 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-20, 137+y], [x-10, 50 + rly], 6)

def draw_bal_rl3(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-55, y-185, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, BLACK, [5 + x, y-60], [x-90, y-55], 8)
    

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [15 + x, 100 + lly], 6)
    pygame.draw.line(screen, C_RL, [40 + x, 97+y], [15 + x, 100 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-10, 50 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-20, 137+y], [x-10, 50 + rly], 6)

def draw_bal_rl4(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-30, y-188, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, C_LH, [5 + x, y-60], [x+30, y-30], 6)
    pygame.draw.line(screen, C_RH, [5 + x, y-75], [x+30, y-35], 6)
    

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [15 + x, 100 + lly], 6)
    pygame.draw.line(screen, C_RL, [40 + x, 97+y], [15 + x, 100 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-10, 50 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-20, 137+y], [x-10, 50 + rly], 6)

def draw_bal_rl5(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-25, y-185, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, C_RH, [5 + x, y-60], [x+60, y-35], 6)
    pygame.draw.line(screen, C_LH, [5 + x, y-70], [x+60, y-35], 6)
    

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [15 + x, 100 + lly], 6)
    pygame.draw.line(screen, C_RL, [40 + x, 97+y], [15 + x, 100 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-10, 50 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-20, 137+y], [x-10, 50 + rly], 6)

def draw_bal_rl6(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-20, y-185, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, BLACK, [5 + x, y-60], [x+90, y-55], 8)
    

    # Legs
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [15 + x, 100 + lly], 6)
    pygame.draw.line(screen, C_RL, [40 + x, 97+y], [15 + x, 100 + lly], 6)

    
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-10, 50 + rly], 6)
    pygame.draw.line(screen, C_LL, [x-20, 137+y], [x-10, 50 + rly], 6)

def draw_bal_ll1(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-35, y-190, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, C_RH, [5 + x, y-60], [x-20, y-30], 6)
    pygame.draw.line(screen, C_LH, [5 + x, y-75], [x-20, y-35], 6)
    

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-15, 100 + lly], 6)
    pygame.draw.line(screen, C_LL, [x-40, 97+y], [x-15, 100 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [x+15, 50 + rly], 6)
    pygame.draw.line(screen, C_RL, [x+20, 137+y], [x+15, 50 + rly], 6)

def draw_bal_ll2(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-45, y-188, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, C_RH, [5 + x, y-60], [x-60, y-35], 6)
    pygame.draw.line(screen, C_LH, [5 + x, y-70], [x-60, y-35], 6)
    

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-15, 100 + lly], 6)
    pygame.draw.line(screen, C_LL, [x-40, 97+y], [x-15, 100 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [x+15, 50 + rly], 6)
    pygame.draw.line(screen, C_RL, [x+20, 137+y], [x+15, 50 + rly], 6)

def draw_bal_ll3(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-55, y-185, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, BLACK, [5 + x, y-60], [x-90, y-55], 8)
    

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-15, 100 + lly], 6)
    pygame.draw.line(screen, C_LL, [x-40, 97+y], [x-15, 100 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [x+15, 50 + rly], 6)
    pygame.draw.line(screen, C_RL, [x+20, 137+y], [x+15, 50 + rly], 6)

def draw_bal_ll4(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-30, y-188, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, C_RH, [5 + x, y-60], [x+30, y-30], 6)
    pygame.draw.line(screen, C_LH, [5 + x, y-75], [x+30, y-35], 6)
    

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-15, 100 + lly], 6)
    pygame.draw.line(screen, C_LL, [x-40, 97+y], [x-15, 100 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [x+15, 50 + rly], 6)
    pygame.draw.line(screen, C_RL, [x+20, 137+y], [x+15, 50 + rly], 6)

def draw_bal_ll5(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-25, y-185, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, C_RH, [5 + x, y-60], [x+60, y-35], 6)
    pygame.draw.line(screen, C_LH, [5 + x, y-70], [x+60, y-35], 6)
    

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-15, 100 + lly], 6)
    pygame.draw.line(screen, C_LL, [x-40, 97+y], [x-15, 100 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [x+15, 50 + rly], 6)
    pygame.draw.line(screen, C_RL, [x+20, 137+y], [x+15, 50 + rly], 6)
    
def draw_bal_ll6(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300

    myFont = pygame.font.SysFont("comicsansms", 20)
    textL = myFont.render("LEFT LEG", True, BLACK)
    textR = myFont.render("RIGHT LEG", True, GREEN)
    

    # render text
    screen.blit(textL,(500,250))
    screen.blit(textR,(500,280))   

    # Head
    #head
    pygame.draw.ellipse(screen, C_H, [x-20, y-185, 90, 90], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x,  y+40], [5 + x, y-100], 6)

    # Hands
    pygame.draw.line(screen, BLACK, [5 + x, y-60], [x+90, y-55], 8)
    

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, y+40], [x-15, 100 + lly], 6)
    pygame.draw.line(screen, C_LL, [x-40, 97+y], [x-15, 100 + lly], 6)

    
    pygame.draw.line(screen, C_RL, [5 + x, y+40], [x+15, 50 + rly], 6)
    pygame.draw.line(screen, C_RL, [x+20, 137+y], [x+15, 50 + rly], 6)

def bal():
    screen.fill(WHITE)
    draw_bal_init(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)
    
    screen.fill(WHITE)
    draw_bal_rl1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_rl2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_rl3(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_rl2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)
    
    screen.fill(WHITE)
    draw_bal_rl1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_rl4(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_rl5(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_rl6(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_init(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_ll1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_ll2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_ll3(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_ll2(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_ll1(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_ll4(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_ll5(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)

    screen.fill(WHITE)
    draw_bal_ll6(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
    time.sleep(0.3)


# Setup
pygame.init()
pygame.font.init()

# Set the width and height of the screen [width,height]
size = [1100, 600]
screen = pygame.display.set_mode(size)

pygame.display.set_caption("Fit-O-Phila")

# Loop until the user clicks the close button.
done = False
done_lunge = False
done_head = False
done_balance = False

# Used to manage how fast the screen updates
clock = pygame.time.Clock()

#F|dumbbellCurl
def curl():
  while done:
    RLHup()
    time.sleep(1)
    normal()
    time.sleep(1)
  normal()

#F|lunge
def lunge():
  while done_lunge:
    ll()
    rl()
  normal()

#F|head
def head():
  while done_head:
    headMoving()
  normal()

#F|balance
def balance():
  while done_balance:
    bal()
  normal()

def stick():
  global done, C_LH, C_RH, C_LL, C_RL, C_RL1,C_H, done_lunge,done_head, done_balance
  normal()
  while 1:
    data, addr = sockStick.recvfrom(1024)
    trimData = data.rstrip(' \t\r\n\0')
    print trimData
    myList = trimData.split("|")

    if myList[0] =="F":
      if myList[1] == "dumbbellCurl":
        done_lunge = False
        done_head = False
        done_balance = False
        done = True
        thread.start_new_thread(curl, ( ))
      elif myList[1] == "legLunge":
        print "got lunge"
        done=False
        done_head=False
        done_balance=False
        done_lunge = True
        thread.start_new_thread(lunge, ( ))
      elif myList[1] == "cardio":
        done=False
        done_balance=False
        done_lunge=False
        done_head = True
        thread.start_new_thread(head, ( ))
      elif myList[1] == "coolDown":
        done=False
        done_head=False
        done_lunge=False
        done_balance = True
        thread.start_new_thread(balance, ( ))        
      elif myList[1] == "end":
        done = False
        done_lunge = False
        done_head = False
        done_balance = False
        C_LH = C_RH = BLACK
        C_LL = BLACK
        C_RL = GREEN
        C_RL1 = BLACK
        C_H = BLACK
        print "before normal"
        time.sleep(1)
        #normal()
    elif myList[0]=="pause":
        done = False
        done_lunge = False
        done_head = False
        done_balance = False
        C_LH = C_RH = BLACK
        C_LL = BLACK
        C_RL = GREEN
        C_RL1 = BLACK
        C_H = BLACK

    elif myList[0] == "RH":
      if myList[1] == "Correct":
        C_RH = BLACK
      elif myList[1] == "Wrong":
        C_RH = RED

    elif myList[0] == "LH":
      if myList[1] == "Correct":
        C_LH = BLACK
      elif myList[1] == "Wrong":
        C_LH = RED

    elif myList[0] == "LL":
      if myList[1] == "Correct":
        C_LL = BLACK
      elif myList[1] == "Wrong":
        C_LL = RED

    elif myList[0] == "RL":
      if myList[1] == "Correct":
        C_RL = GREEN
        C_RL1 = BLACK
      elif myList[1] == "Wrong":
        C_RL = RED
        C_RL1 = RED

    elif myList[0] == "H":
      if myList[1] == "Correct":
        C_H = BLACK
      elif myList[1] == "Wrong":
        C_H = RED
    


    # ALL EVENT PROCESSING SHOULD GO BELOW THIS COMMENT

    clock.tick(60)



try:
  thread.start_new_thread(receive, ( ))
  thread.start_new_thread(stick, ( ))
  timer = fig.canvas.new_timer(interval=100)
  timer.add_callback(RealtimePloter, ())
  timer.start()
  pylab.show()
except:
  print "Error: unable to start thread"

while 1:
  pass

'''
F|dumbbellCurl
RH|Correct
RH|Wrong
LH|Correct
F|end'''
