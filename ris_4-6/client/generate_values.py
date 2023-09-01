import sqlite3
import random
from datetime import datetime


def generate(con_str):
    objects = ('E37', 'H81', 'H95', 'K3', 'L8')

    connection = sqlite3.connect(con_str)
    cursor = connection.cursor()

    print('Сгенерированные значения:')
    for i in range(5):
        value = random.uniform(0.01, 99.99)
        value = round(value, 4)
        now = datetime.now()
        now = now.strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(f"insert into 'BODI' (object, value, timestamp) values ('{objects[i]}', {value}, '{now}')")
        connection.commit()
        print(f'\nОбъект: {objects[i]}\nЗначение: {value}\nВремя: {now}')

    cursor.close()
    connection.close()


def main():
    generate('client_db.sqlite3')
    generate('client1_db.sqlite3')


if __name__ == '__main__':
    main()
