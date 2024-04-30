import React, { useState } from "react";
import { Form, Select, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";

type CatNames =
  | "Mr. Kitters"
  | "Niko"
  | "Tildy"
  | "Cubbie"
  | "Tonks"
  | "Bear-Bear";

interface Ability {
  name: string;
  damage: number;
}

interface DataType {
  name: CatNames;
  age: number;
  attributes: {
    kind: string;
    meowVolume: string;
    speed: string;
  };
  abilities: Ability[];
}

const data: DataType[] = [
  {
    key: "1",
    name: "Mr. Kitters",
    age: 5,
    attributes: {
      kind: "Classic tabby with white fur on the front",
      meowVolume: "Normal",
      speed: "Fast",
    },
    abilities: [
      {
        name: "Run",
        damage: 0,
      },
      {
        name: "Meow",
        damage: 75,
      },
      {
        name: "Bite",
        damage: 40,
      },
    ],
  },
  {
    key: "2",
    name: "Niko",
    age: 3,
    attributes: {
      kind: "Ginger with little bit of tuxedo",
      meowVolume: "Loud",
      speed: "Fast",
    },
    abilities: [
      {
        name: "Run",
        damage: 0,
      },
      {
        name: "Meow",
        damage: 125,
      },
      {
        name: "Bite",
        damage: 20,
      },
    ],
  },
  {
    key: "3",
    name: "Tildy",
    age: 2.5,
    attributes: {
      kind: "Calico with mostly white fur",
      meowVolume: "Low",
      speed: "Very fast",
    },
    abilities: [
      {
        name: "Run",
        damage: 50,
      },
      {
        name: "Meow",
        damage: 45,
      },
      {
        name: "Bite",
        damage: 45,
      },
    ],
  },
];

const COLUMN_NAMES: Record<NestedKeyOf<DataType>, string> = {
  "attributes.kind": "",
  "attributes.meowVolume": "",
  "attributes.speed": "",
  abilities: "",
  age: "Age",
  attributes: "",
  name: "Name",
};

const App: React.FC = () => {
  const [hiddenColumns, setHiddenColumns] = useState<
    Array<NestedKeyOf<DataType>>
  >([]);

  const columns = createColumns<DataType, "actions">(
    [
      {
        title: "Name",
        name: "name",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Age",
        name: "age",
      },
      {
        title: "Action",
        name: "actions",
        render: (_, record) => (
          <Space size="middle">
            <a>Invite {record.name}</a>
            <a>Delete</a>
          </Space>
        ),
      },
    ],
    hiddenColumns
  );

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Hello</h1>

      <Form
        onValuesChange={(values) => {
          if (values.hiddenColumns) {
            setHiddenColumns(values.hiddenColumns);
          }
        }}
      >
        <Form.Item label="Hidden columns" name="hiddenColumns">
          <Select
            mode="multiple"
            options={Object.keys(COLUMN_NAMES)
              .filter(
                (item) => COLUMN_NAMES[item as keyof typeof COLUMN_NAMES] !== ""
              )
              .map((item) => ({
                label: COLUMN_NAMES[item as keyof typeof COLUMN_NAMES],
                value: item,
              }))}
          />
        </Form.Item>
      </Form>

      <Table columns={columns} dataSource={data} />
    </main>
  );
};

export default App;

// Helper functions.
type NewColumnType<TData extends object, TColumnName extends string> = Omit<
  ColumnType<TData>,
  "key" | "dataIndex"
> & {
  name: TColumnName;
};

type NestedKeyOf<T> = T extends Array<unknown>
  ? never
  : T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${NestedKeyOf<T[K]>}`}`;
    }[keyof T]
  : never;

function createColumns<
  TData extends object,
  TStaticColumnName extends string = never,
  TColumnName extends string = NestedKeyOf<TData>
>(
  columns: NewColumnType<TData, TColumnName | TStaticColumnName>[],
  hiddenColumns: Array<TColumnName>
): ColumnType<TData>[] {
  const columnsWithKey: ColumnType<TData>[] = columns
    .filter((column) => {
      if (!column.name) return true;

      return !(hiddenColumns as string[]).includes(column.name);
    })
    .map((column, index) => ({
      ...column,
      dataIndex: column.name,
      key: column.name ?? `column-${index}`,
    }));

  return columnsWithKey;
}
