import board
import neopixel
import time

pixels = neopixel.NeoPixel(board.D18, 1, pixel_order=neopixel.RGBW)
#pixels[0]=(255, 0, 0, 0) # Green
#pixels[0]=(0, 255, 0, 0) # Red
#pixels[0]=(0, 0, 255, 0) # Blue
#pixels[0]=(25, 25, 25, 25) # White
for i in range(10):
    pixels.fill((25, 25, 25, 25))
    pixels.show()
    time.sleep(0.5)

    pixels.fill((0,0,0,0)) # off
    pixels.show()
    time.sleep(0.5)