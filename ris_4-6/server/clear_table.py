import sqlite3


def clear(con_str):
    db = sqlite3.connect(con_str)
    cursor = db.cursor()
    cursor.execute("delete from 'BODI';")
    db.commit()
    cursor.close()
    db.close()


def main():
    clear('server_db.sqlite3')
    clear(r'D:\6 семестр\РИС\Лабораторные\ris_4-6\client\client_db.sqlite3')
    clear(r'D:\6 семестр\РИС\Лабораторные\ris_4-6\client\client1_db.sqlite3')


if __name__ == '__main__':
    main()
