import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT)

# Nao tenho nenhuma ideia porque esta funcionado desta maneira !!
print("LAMPADA LIGADA\n")
