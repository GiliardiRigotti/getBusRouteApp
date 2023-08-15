import * as SQLite from 'expo-sqlite';

const version = '0'

export async function sql() {
    const db = SQLite.openDatabase('dbName', version);

    const resultTable = await db.execAsync([{
        sql: `CREATE TABLE ads (ad text, image text)`, args: []
    }], false
    );
    console.log(resultTable);

    let ad = "julio"
    let image = "testebase64"

    const resultInsert = await db.execAsync([{
        sql: `INSERT INTO ads(ad,image) VALUES ('${ad}','${image}')`, args: []
    }], false
    );
    console.log(resultInsert)

    const resultSelect = await db.execAsync([{
        sql: `SELECT * FROM ads`, args: []
    }], false);

    console.log(resultSelect[0].rows);
}
