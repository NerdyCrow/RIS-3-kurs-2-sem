import sqlite3
from support_function import check_connection, get_state
from support_function import SERVER_CONNECTION_STRING, CLIENTS_CONNECTION_STRINGS


def pull(con_str):
    try:
        connection = sqlite3.connect(con_str)
        cursor = connection.cursor()
        data = cursor.execute('select * from BODI;').fetchall()
        cursor.close()
        connection.close()
        server_db = sqlite3.connect(SERVER_CONNECTION_STRING)
        server_cursor = server_db.cursor()
        for row in data:
            print(row)
            server_cursor.execute(f"insert into 'BODI' (object, value, timestamp) values ('{row[1]}', {row[2]}, '{row[3]}')")
            server_db.commit()
        server_cursor.close()
        server_db.close()
    except sqlite3.Error as error:
        print('Ошибка вытягивания данных\n', error)


def extrusive_pull(con_str):
    pull(con_str)
    connection = sqlite3.connect(con_str)
    cursor = connection.cursor()
    print('Удаление данных из базы клиента')
    cursor.execute("delete from 'BODI';")
    connection.commit()
    cursor.close()
    connection.close()


def ask_client(con_str, extrusive=False):
    print(f'Строка подключения: {con_str}')
    if check_connection(con_str) is False:
        return
    print('Запрос состояния')
    print(f'Число записей в БД: {get_state(con_str)}\n')
    print('Выталкивающее копирование данных')
    if extrusive:
        extrusive_pull(con_str)
    else:
        pull(con_str)


def main():
    ask_client(CLIENTS_CONNECTION_STRINGS[0], extrusive=True)
    print()
    ask_client(CLIENTS_CONNECTION_STRINGS[1], extrusive=False)


if __name__ == '__main__':
    main()

