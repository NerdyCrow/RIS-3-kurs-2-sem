import sqlite3


SERVER_CONNECTION_STRING = 'server_db.sqlite3'
CLIENTS_CONNECTION_STRINGS = (
    r'D:/6 семестр/РИС/Лабораторные/ris_4-6/client/client_db.sqlite3',
    r'D:/6 семестр/РИС/Лабораторные/ris_4-6/client/client1_db.sqlite3',
)


def check_connection(con_str) -> bool:
    result: bool
    try:
        connection = sqlite3.connect(con_str)
        cursor = connection.cursor()
        cursor.execute('select sqlite_version();')
        cursor.fetchone()
        cursor.close()
        connection.close()
        return True
    except sqlite3.Error as error:
        print('Ошибка подключения к базе данных\n', error)
        return False


def get_state(con_str) -> int:
    result = 0
    try:
        connection = sqlite3.connect(con_str)
        cursor = connection.cursor()
        cursor.execute('select count(*) from BODI;')
        result = cursor.fetchone()[0]
        cursor.close()
        connection.close()
    except sqlite3.Error as error:
        print('Ошибка запроса состояния\n', error)
    return result
