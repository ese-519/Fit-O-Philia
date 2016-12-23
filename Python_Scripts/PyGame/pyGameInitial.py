


"""
Sample Python/Pygame Programs
Simpson College Computer Science
http://programarcadegames.com/
http://simpson.edu/computer-science/
"""

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




def draw_stick_figure(screen, lhy, rhy, lly, rly):
    x = 200
    y = 300
    C_LH = C_RH = C_LL = C_RL = BLACK
    if lhy == 200:
        C_LH = RED
    if rhy == 200:
        C_RH = RED
    if lly == 200:
        C_LL = RED
    if rly == 200:
        C_RL = RED




    myFont = pygame.font.SysFont("comicsansms", 20)
    textLH = myFont.render("Left Hand: "+ str("{0:}".format(LH)), True, (0, 128, 0))
    textRH = myFont.render("Right Hand: "+ str("{0:}".format(RH)), True, (0, 128, 0))
    textLL = myFont.render("Left Leg: "+ str("{0:}".format(LL)), True, (0, 128, 0))
    textRL = myFont.render("Right Leg: "+ str("{0:}".format(RL)), True, (0, 128, 0))
    textHead = myFont.render("Exercise Counter ", True, (0, 128, 0))
    

    # render text
    screen.blit(textHead,(440,70))
    screen.blit(textLH,(500,100))
    screen.blit(textRH,(500,130))
    screen.blit(textLL,(500,160))
    screen.blit(textRL,(500,190))    

    # Head
    pygame.draw.ellipse(screen, BLACK, [x-35, y-250, 90, 90], 2)

    # Legs
    pygame.draw.line(screen, C_LL, [5 + x, 17 + y], [100 + x, 137 + lly], 2)
    pygame.draw.line(screen, C_RL, [5 + x, 17 + y], [x-80, 127 + rly], 2)

    # Body
    pygame.draw.line(screen, BLACK, [5 + x, 17 + y], [5 + x, y-160], 2)

    # Arms
    #upper
    pygame.draw.line(screen, C_LH, [5 + x, y-140], [30 + x, y-70], 2)#right
    pygame.draw.line(screen, C_RH, [5 + x, y-140], [x-20, y-70], 2)#left
    #lower
    pygame.draw.line(screen, C_LH, [30 + x, y-70], [60 + x, lhy-20], 2)
    pygame.draw.line(screen, C_RH, [x-20, y-70], [x-50, rhy-20], 2)


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
def RHdown():
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

def RLdown():
    global Rly
    Rly = 300
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def LLdown():
    global Lly
    Lly = 300
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def RLBothdown():
    global Rly, Lly
    Rly = 300
    Lly = 300
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()

def normal():
    global Lhy, Rhy, Lly, Rly
    Lhy = Rhy = Lly = Rly = 300
    pygame.display.flip()
    screen.fill(WHITE)
    draw_stick_figure(screen, Lhy, Rhy, Lly, Rly)
    pygame.display.flip()
# Setup
pygame.init()
pygame.font.init()

# Set the width and height of the screen [width,height]
size = [1100, 600]
screen = pygame.display.set_mode(size)

pygame.display.set_caption("QuantaFit")

# Loop until the user clicks the close button.
done = False

# Used to manage how fast the screen updates
clock = pygame.time.Clock()

# Hide the mouse cursor
# pygame.mouse.set_visible(0)

def stick():
    # -------- Main Program Loop -----------
    global done
    while not done:
        # ALL EVENT PROCESSING SHOULD GO BELOW THIS COMMENT
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                done = True
        # ALL EVENT PROCESSING SHOULD GO ABOVE THIS COMMENT

        # ALL GAME LOGIC SHOULD GO BELOW THIS COMMENT

        normal()
        time.sleep(1)
        RLdown()
        time.sleep(1)
        #RHup()
        #time.sleep(1)
        #done=True
        #normal()
        #time.sleep(1)
        RLup()
        time.sleep(1)

        LHup()
        time.sleep(1)
        LLup()
        time.sleep(1)

        RHdown()
        time.sleep(1)
        RLdown()
        time.sleep(1)

        LHdown()
        time.sleep(1)
        LLdown()
        time.sleep(1)
        
        # Call draw stick figure function
        #pos = pygame.mouse.get_pos()

        # ALL GAME LOGIC SHOULD GO ABOVE THIS COMMENT

        # ALL CODE TO DRAW SHOULD GO BELOW THIS COMMENT

        # First, clear the screen to white. Don't put other drawing commands
        # above this, or they will be erased with this command.


        # ALL CODE TO DRAW SHOULD GO ABOVE THIS COMMENT

        # Go ahead and update the screen with what we've drawn.


        # Limit to 20 frames per second
        clock.tick(60)
stick()

# Close the window and quit.
# If you forget this line, the program will 'hang'
# on exit if running from IDLE.
pygame.quit()
