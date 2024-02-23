import { useState } from "react"
import { 
  useAdminCreateProduct, 
  useAdminCustomPost, 
  useAdminUploadFile,
  useAdminCollections,
} from "medusa-react"
import { 
  CreateProductMediaRequest, 
  CreateProductMediaResponse, 
} from "../../../../types/product-media"
import { 
  Button, 
  Container, 
  Input, 
  Label, 
  Select,
} from "@medusajs/ui"
import { RouteProps } from "@medusajs/admin-ui"
import { useNavigate } from "react-router-dom"

let baseOptionId = 1;

const initialOption = {
  name: '',
  label: '',
  type: 'int',
  min: 1,
  max: undefined,
  required: false
}

const StickProductCreateForm = ({
  notify,
}: RouteProps) => {
  const [productName, setProductName] = useState("")
  const [
    description, 
    setDescription,
  ] = useState("")
  const [priceType, setPriceType] = useState("fixed")
  const [priceFormula, setPriceFormula] = useState("")
  const [price, setPrice] = useState('0')
  const [file, setFile] = useState<File>()
  const [optionList, setOptionList] = useState([]);

  const createProduct = useAdminCreateProduct()
  const uploadFile = useAdminUploadFile()
  const { collections } = useAdminCollections()
  const [collectionId, setCollectionId] = useState('')
  const { 
    isLoading,
  } = useAdminCustomPost<
    CreateProductMediaRequest,
    CreateProductMediaResponse
  >(
    "/product-stick",
    ["product-stick"]
  )

  const navigate = useNavigate()

  const handleAddOption = () => {
    setOptionList([...optionList, { ...initialOption, id: baseOptionId++ }])
  }

  const handleChangeOptionParam = (optionId, name) => (value) => {
    const formattedList = optionList.map((item) => item.id === optionId ? { ...item, [name]: value} : item);

    setOptionList(formattedList)
  }

  const handleAddDropdownOption = (optionId, name) => () => {
    const defaultDropdownOption = { label: '', value: '' }
    const formattedList = optionList
      .map((item) => item.id === optionId ? { ...item, [name]:  [...(item[name] || []), defaultDropdownOption]} : item);

    setOptionList(formattedList)
  }

  const handleChangeDropdownOption = (optionId, name) => (idx, value) => {
    const formattedList = optionList
      .map((item) => 
          item.id === optionId 
          ? { 
              ...item, 
              options: item.options.map((i, optionIdx) => optionIdx === idx ? { ...i, [name]: value} : i) 
            } 
          : item);

    setOptionList(formattedList)
  }

  console.log(optionList)

  const handleCreateProduct = (urls?: string[]) => {
        const optionsObj = optionList.reduce((acc, { name, ...value }) => ({ ...acc, [name]: value}), {})
        console.log(optionsObj)
        // @ts-ignore
        createProduct.mutate({ 
          title: productName, 
          collection_id: collectionId,
          // @ts-ignore
          status: "published",
          images: urls,
          variants: [{
            title: 'Test',
            inventory_quantity: 9999,
            manage_inventory: false,
            allow_backorder: false,
            options: [{value: 'Test'}],
            prices: []
          }],
          options: [{title: 'Test'}],
          metadata: {
            priceType: priceType,
            priceFormula: priceFormula,
            price: price,
            tabs: [
                {
                  label: "Waterproof",
                  content: "These stickers are waterproof and can be used in any environment"
                },
                {
                  label: "Custom",
                  content: "Customize your stickers with your own design"
                }
              ],
              options: {
                quantity: {
                  label: "Quantity",
                  type: "int",
                  required: true,
                  min: 1
                },
                ...optionsObj
              }
          }
        }, {
          onSuccess: ({ product }) => {
            navigate('/a/products')
          },
        })
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if(file) {
      uploadFile.mutate(file, {
        onSuccess: ({ uploads }) => {
          const urls = uploads.map((image) => image.url)
          handleCreateProduct(urls)
        }
      })
    }else {
      handleCreateProduct()
    }
  }

  return (
    <Container>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4"
      >
        <div className="flex gap-4 items-center">
          <div className="w-1/4">
            <Label>Product Name</Label>
          </div>
          <div className="flex-grow">
            <Input 
              type="text" 
              placeholder="Product Name" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-1/4">
            <Label>Description</Label>
          </div>
          <div className="flex-grow">
            <Input 
              type="text" 
              placeholder="Product Description" 
              value={description} 
              onChange={(e) => 
                setDescription(e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-1/4">
            <Label>Collection</Label>
          </div>
          <div className="flex-grow">
            <Select onValueChange={setCollectionId} value={collectionId}>
              <Select.Trigger>
                <Select.Value placeholder="Collection" />
              </Select.Trigger>
              <Select.Content className="z-50">
                  { collections?.map(({id, title}) => (
                      <Select.Item value={id}>
                          { title }
                      </Select.Item>
                  ))}
              </Select.Content>
            </Select>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-1/4">
            <Label>Price Type</Label>
          </div>
          <div className="flex-grow">
            <Select onValueChange={(e) => { 
                  setPriceType(e);
                  setPriceFormula('');
              }} value={priceType}>
              <Select.Trigger>
                <Select.Value placeholder="Type" />
              </Select.Trigger>
              <Select.Content className="z-50">
                <Select.Item value={"fixed"}>
                  Fixed
                </Select.Item>
                <Select.Item value={"calculated"}>
                  Calculated
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>
        { priceType === 'calculated' && 
        <>
            <div className="flex gap-4 items-center">
                <div className="w-1/4">
                  <Label>Price Formula</Label>
                </div>
                <div className="flex-grow">
                  <Input 
                      type="text" 
                      placeholder="Price Formula" 
                      value={priceFormula} 
                      onChange={(e) => setPriceFormula(e.target.value)}
                  />
                </div>
            </div>
        </>
        }
        <div className="flex gap-4 items-center">
          <div className="w-1/4">
            <Label>Base Price</Label>
          </div>
          <div className="flex-grow">
            <Input 
                type="number" 
                placeholder="Base price" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-1/4">
            <Label>File</Label>
          </div>
          <Input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
          { optionList?.map(({ id, type, name, label, min, max, options }) => (
            <>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex gap-4 items-center">
                  <div className="w-1/4">
                    <Label>Option Params:</Label>
                  </div>
                  <div className="flex-grow">
                    <Input 
                          type="text" 
                          placeholder="Name" 
                          value={name} 
                          onChange={(e) => handleChangeOptionParam(id, 'name')(e.target.value)}
                      />
                  </div>
                  <div className="flex-grow">
                    <Input 
                          type="text" 
                          placeholder="Label" 
                          value={label} 
                          onChange={(e) => handleChangeOptionParam(id, 'label')(e.target.value)}
                      />
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <Select onValueChange={handleChangeOptionParam(id, 'type')} value={type}>
                    <Select.Trigger>
                      <Select.Value placeholder="Type" />
                    </Select.Trigger>
                    <Select.Content className="z-50">
                      <Select.Item value={"int"}>
                        Int
                      </Select.Item>
                      <Select.Item value={"float"}>
                        Float
                      </Select.Item>
                      <Select.Item value={"dropdown"}>
                        Dropdown
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </div>
                { (type === 'int' || type === 'float') && (
                  <div className="flex gap-4 items-center">
                    <div className="w-1/4">
                      <Label>Int/Float params:</Label>
                    </div>
                    <div className="flex-grow">
                      <Input 
                          type="text" 
                          placeholder="Min value" 
                          value={min} 
                          onChange={(e) => handleChangeOptionParam(id, 'min')(e.target.value)}
                      />
                    </div>
                    <div className="flex-grow">
                      <Input 
                        type="text" 
                        placeholder="Max Value" 
                        value={max} 
                        onChange={(e) => handleChangeOptionParam(id, 'max')(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                { type === 'dropdown' && (
                  <>
                  <div className="flex gap-4 items-center w-full">
                    <div className="w-1/4">
                      <Label>Dropdown params:</Label>
                    </div>
                    <div>
                      <Button type="button" variant="secondary" onClick={ handleAddDropdownOption(id, 'options') } >
                        Add dropdown item
                      </Button>
                    </div>
                  </div>
                  { options?.map(({label, value}, idx) =>
                    <div className="flex gap-4 items-center w-full">
                      <div className="flex-grow">
                        <Input 
                            type="text" 
                            placeholder="Label" 
                            value={label} 
                            onChange={(e) => handleChangeDropdownOption(id, 'label')(idx, e.target.value)}
                        />
                      </div>
                      <div className="flex-grow">
                        <Input 
                              type="text" 
                              placeholder="Value" 
                              value={value} 
                              onChange={(e) => handleChangeDropdownOption(id, 'value')(idx, e.target.value)}
                          />
                      </div>
                    </div>
                    )}
                </>
                )}
              </div>
            </>
          ))}
        <Button type="button" variant="secondary" onClick={ handleAddOption } >
          Add option
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          isLoading={
            createProduct.isLoading || 
            uploadFile.isLoading || 
            isLoading
          }>
          Create
        </Button>
      </form>
    </Container>
  )
}

export default StickProductCreateForm