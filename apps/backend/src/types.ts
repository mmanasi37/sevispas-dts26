import {
    ColumnType,
    Generated,
    GeneratedAlways,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
    person: PersonTable
    pet: PetTable
    audit: AuditTable
    // toy: ToyTable
    // wine: WineTable
    // wine_stock_change: WineStockChangeTable
}

interface AuditTable {
    id: Generated<number>
    action: string
}

export interface PersonTable {
    id: Generated<number>
    first_name: string
    last_name: string | null
    gender: 'male' | 'female' | 'other' | null
    metadata: JSONColumnType<{
        login_at: string
        ip: string | null
        agent: string | null
        plan: 'free' | 'premium'
    }> | null
    // address: { city: string } | null
    // age: number | null
    // birthdate: ColumnType<Date | null, string | null | undefined, string | null>
    // experience: { role: string }[] | null
    // has_pets: Generated<'Y' | 'N'>
    // middle_name: string | null
    // nicknames: string[] | null
    // nullable_column: string | null
    // profile: {
    //     addresses: { city: string }[]
    //     website: { url: string }
    // } | null
    // updated_at: ColumnType<Date | null, string | null | undefined, string | null>
    // // created_at: ColumnType<Date, string | undefined, never>
    // created_at: GeneratedAlways<Date>
    // deleted_at: ColumnType<Date | null, string | null | undefined, string | null>
    // marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
}

export type Person = Selectable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>

export interface PetTable {
    id: Generated<number>
    name: string
    owner_id: number
    species: 'dog' | 'cat'
}

export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>

