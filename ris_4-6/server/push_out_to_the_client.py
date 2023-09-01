import sqlite3
from support_function import check_connection
from support_function import SERVER_CONNECTION_STRING, CLIENTS_CONNECTION_STRINGS


def push(con_str):
    if check_connection(con_str) is False:
        return

    try:
        server_connection = sqlite3.connect(SERVER_CONNECTION_STRING)
        cursor = server_connection.cursor()
        data = cursor.execute('select * from BODI;').fetchall()
        cursor.close()
        server_connection.close()

        client_connection = sqlite3.connect(con_str)
        client_cursor = client_connection.cursor()
        for row in data:
            print(row)
            client_cursor.execute(f"insert into 'BODI' (object, value, timestamp) values ('"
                                  f"{row[1]}', {row[2]}, '{row[3]}')")
            client_connection.commit()
        client_cursor.close()
        client_connection.close()
    except sqlite3.Error as error:
        print('Ошибка отправки данных\n', error)


def main():
    push(CLIENTS_CONNECTION_STRINGS[0])
    print()
    push(CLIENTS_CONNECTION_STRINGS[1])


if __name__ == '__main__':
    main()
