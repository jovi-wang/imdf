import board
import neopixel

pixels = neopixel.NeoPixel(board.D18, 1, pixel_order=neopixel.RGBW)
pixels[0]=(255, 0, 0, 0) # Green
#pixels[0]=(0, 255, 0, 0) # Red
#pixels[0]=(0, 0, 255, 0) # Blue
#pixels[0]=(25, 25, 25, 25) # White
pixels.show()

