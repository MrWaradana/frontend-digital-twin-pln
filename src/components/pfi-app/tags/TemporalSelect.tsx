import { Select, SelectItem } from "@nextui-org/react";

const TemporalSelect = ({ selectItems, title, selectedKey, setSelectedKey }: { selectItems: any, title: string, selectedKey: any, setSelectedKey: any }) => {



  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        label={title}
        className="max-w-xs"
        defaultSelectedKeys={[selectedKey]}
        selectedKeys={selectedKey}
        onSelectionChange={setSelectedKey}
      >
        {
          selectItems.map((item: any) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))
        }
      </Select>
    </div>
  )
}

export default TemporalSelect