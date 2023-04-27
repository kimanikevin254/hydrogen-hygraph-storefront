import { useLoaderData } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';

export const meta = () => {
  return {
    title: 'Hydrogen',
    description: 'A custom storefront powered by Hydrogen'
  };
};

// query to fetch all products from Hygraph
const getAllProductsFromHygraph = `
    query Products {
        products {
            id
            productId
            color
    }
  }
`;

// query to fetch all products from Shopify
const getAllProductsFromShopify = `#graphql
    query products($ids: [ID!]!) {
        nodes(ids: $ids) {
        ...on Product {
            id
            title
            handle
            featuredImage {
                url
                width
                height
            }
            description
            priceRange {
            minVariantPrice {
                amount
            }
            }
        }
        }
    }
`

export async function loader({ context }) {
    // fetch the products from Hygraph
  const response = await fetch('<your-hygraph-content-api-endpoint>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: getAllProductsFromHygraph })
  });

  const { data } = await response.json();

  // extract the product IDs from the Hygraph response and psuh them into an array
  const productsArray = data?.products.map(prod => prod.productId)

  // query the Shopify storefront for the products info and pass the array containing the product IDs
  const res = await context.storefront.query(getAllProductsFromShopify, {
    variables: {
        ids: productsArray
    }
  })

  // return the data fetched from Hygraph and Shopify
  // products => the data fetched from Shopify
  // data => the data fetched from Hygraph  
  return { products: res.nodes, data: data.products }
}

export default function Index() {
  const { products, data } = useLoaderData();

  console.log(products)
  console.log(data)
  return (
    <section className="w-full gap-4">
      <h2 className="font-bold text-2xl mb-4">Products</h2>
      <div className="flex space-x-6">
        {/* Loop through the products and diplay the necessary info */}
          {products.map((product, i) => {
            return (
                <div key={product.id} className="grid gap-4">
                  {product?.featuredImage && (
                    <div className='h-64 w-96'>
                        <Image
                            alt={`Image of ${product.title}`}
                            data={product.featuredImage}
                            className='w-full h-full object-cover rounded'
                        />
                    </div>
                  )}
                  <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
                    <span>{product.title} {' • '}</span>
                     
                    <span className='text-sm text-gray-500'>{product.id === data[i].productId && `${data[i].color}`} {' • '}</span> 
                     <span>Kshs. {product.priceRange.minVariantPrice.amount}</span>
                  </h2>
                </div>
            );
          })}
        </div>
    </section>
  );
}