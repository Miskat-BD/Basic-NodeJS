import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProducts } from "../types/products";
import { bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url
    const method = req.method
    const urlParams = url?.split("/")
    // console.log(urlParams)
    const id = urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null
    // console.log(id)

    if (url === "/products" && method === "GET") {
        try {
            const products = productService()
            sendResponse(res, true, 200, "Products retirved Successfully!", products)
        } catch (error) {
            sendResponse(res, false, 500, "Internal Server Error")
        }
    }
    else if (method === "GET" && id !== null) {
        const products = productService()
        const product = products.find((p: IProducts) => p.id === id)
        if (!product) {
            return sendResponse(res, false, 404, "Product Not Found!")
        }

        try {
            const products = productService()
            sendResponse(res, true, 200, `Product ${id} is retrived successfully`, product)
        } catch (error) {
            sendResponse(res, false, 500, "Internal Server Error")
        }
    }
    else if (url === "/products" && method === "POST") {
        const body = await bodyParser(req)
        // console.log(body)
        const newProduct = {
            id: Date.now(),
            ...body
        }
        const products = productService()
        products.push(newProduct)
        createProduct(products)
        // console.log(newProduct)
        try {
            const products = productService()
            sendResponse(res, true, 201, "Product created successfully", newProduct)
        } catch (error) {
            sendResponse(res, false, 500, "Internal Server Error")
        }

    } else if (method === 'PUT' && id !== null) {
        const body = await bodyParser(req)
        const products = productService()
        const index = products.findIndex((p: IProducts) => p.id === id)
        // console.log(index)
        if (index < 0) {
            return sendResponse(res, false, 404, "Product Not Found!")
        }

        // console.log(products[index])
        products[index] = { id: products[index].id, ...body }
        createProduct(products)

        try {
            const products = productService()
            sendResponse(res, true, 200, "Product update successfully", products[index])
        } catch (error) {
            sendResponse(res, false, 500, "Internal Server Error")
        }


    } else if (method === 'DELETE' && id !== null) {
        const products = productService()
        const index = products.findIndex((p: IProducts) => p.id === id)
        if (index < 0) {
            return sendResponse(res, false, 404, "Product Not Found!")
        }
        products.splice(index, 1)
        createProduct(products)
        try {
            const products = productService()
            sendResponse(res, true, 200, "Data Deleted Successfully")
        } catch (error) {
            sendResponse(res, false, 500, "Internal Server Error")
        }


    }
}

export default productController;