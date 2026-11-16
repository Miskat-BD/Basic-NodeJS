import type { IncomingMessage, ServerResponse } from "http";
import { productService } from "../service/product.service";
import type { IProducts } from "../types/products";

const productController = (req: IncomingMessage, res: ServerResponse) => {
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
}

export default productController;