#!/usr/bin/env python3
"""
FastAPI wrapper for OpenFoodFacts API
Install with: uv add fastapi openfoodfacts uvicorn httpx
Run with: uv run uvicorn main:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException, Request
import openfoodfacts
import httpx

app = FastAPI(title="OpenFoodFacts API", version="1.0.0")

# Initialize OpenFoodFacts API
api = openfoodfacts.API(user_agent="MinihackFoodtech/1.0")


@app.get("/")
async def root():
    """Hello World endpoint"""
    return {"message": "OpenFoodFacts API - Use /docs for interactive documentation"}


@app.get("/product/{barcode}")
async def get_product(barcode: str):
    """Get product information by barcode"""
    try:
        product = api.product.get(
            barcode,
            fields=["code", "product_name", "brands", "categories", "ingredients_text"]
        )

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        return product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/search")
async def search_products(request: Request):
    """
    Search for products with full OpenFoodFacts API parameters

    Examples:
    - /search?categories_tags_en=Orange+Juice&nutrition_grades_tags=c
    - /search?fields=code,product_name,nutrition_grades&sort_by=last_modified_t
    """
    try:
        # Get all query parameters
        params = dict(request.query_params)

        # Call OpenFoodFacts API directly with all parameters
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://world.openfoodfacts.org/api/v2/search",
                params=params,
                headers={"User-Agent": "MinihackFoodtech/1.0"},
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
