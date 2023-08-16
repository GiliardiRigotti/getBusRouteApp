import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

type ColumnCreate = {
    name: string,
    type: string,
}

type ColumnInsert = {
    name: string,
    value: string | number | boolean | null,
}


const version = '0'

const getDBConnection = async (dbName: string) => {
    return SQLite.openDatabase(dbName, version)
}

const createTable = async (db: SQLite.SQLiteDatabase, tabName: string, columns: ColumnCreate[]) => {

    try {
        const query = `CREATE TABLE IF NOT EXISTS ${tabName} (${columns.map((column) => {
            return `${column.name}`
        })
            })`

        const resultTable = await db.execAsync([{
            sql: query, args: []
        }], false
        )

        return resultTable[0].rowsAffected
    } catch (e) {
        Alert.alert(`Error: ${e}`)
        return null
    }


}

const insert = async (db: SQLite.SQLiteDatabase, tabName: string, columns: ColumnInsert[]) => {
    try {
        const query = `INSERT INTO ${tabName}(${columns.map((column) => {
            return `${column.name}`
        })
            }) VALUES (${columns.map((column) => {
                return column.value
            })
            })`

        const result = await db.execAsync([{
            sql: query, args: []
        }], false
        )

        return result[0].rowsAffected
    } catch (e) {
        Alert.alert(`Error: ${e}`)
        return null
    }

}

const select = async (db: SQLite.SQLiteDatabase, tabName: string, columns?: string[]) => {
    try {
        const query = `SELECT 
        ${columns ?
                columns.map((column) => {
                    return column
                })
                :
                ` * `
            }
        FROM ${tabName}`

        const result = await db.execAsync([{
            sql: query, args: []
        }], false
        )

        return result[0].rows
    } catch (e) {
        Alert.alert(`Error: ${e}`)
        return null
    }

}

const deleteAll = async (db: SQLite.SQLiteDatabase, tabName: string) => {
    try {
        const query = `DELETE FROM ${tabName}`

        const result = await db.execAsync([{
            sql: query, args: []
        }], false
        )

        return result[0].rows
    } catch (e) {
        Alert.alert(`Error: ${e}`)
        return null
    }

}

export {
    getDBConnection,
    createTable,
    insert,
    select,
    deleteAll
}
