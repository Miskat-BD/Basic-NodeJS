import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProducts } from "../types/products";
import { bodyParser } from "../utils/parseBody";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url
    const method = req.method
    const urlParams = url?.split("/")
    // console.log(urlParams)
    const id = urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null
    // console.log(id)

    if (url === "/products" && method === "GET") {
        const products = productService()
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({
            message: "Products retirved Successfully!",
            data: products
        }))
    } 
    else if (method === "GET" && id !== null) {
        const products = productService()
        const product = products.find((p: IProducts)=> p.id === id)
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({
            message: `Product ${id} is retrived successfully`,
            data: product
        }))
    }
    else if (url === "/products" && method === "POST"){
        const body = await bodyParser(req)
        // console.log(body)
        const newProduct = {
            id : Date.now(),
            ...body
        }
        const products = productService()
        products.push(newProduct)
        createProduct(products)
        // console.log(newProduct)
        res.writeHead(201, {"content-type":"application/json"})
        res.end(JSON.stringify({message: "Product created successfully",
            data: newProduct
        }))
    }
}

export default productController;