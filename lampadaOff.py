import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(7, GPIO.OUT)
print("LAMPADA DESLIGADA\n")
GPIO.output(7, GPIO.LOW)
# NAO TENHO NENHUMA IDEIA PORQUE ESTA FUNCIONADO DESTA MANEIRA!!
GPIO.cleanup()  