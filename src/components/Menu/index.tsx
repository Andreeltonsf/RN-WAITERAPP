import { useState } from "react";
import { FlatList } from "react-native";
import { PlusCircle } from "../../Icons/PlusCircle";
import { Product } from "../../types/Products";
import { formatCurrency } from "../../utils/formatCurrency";
import { ProductModal } from "../ProductModal";
import { Text } from "../text";
import {
  AddToCartButton,
  Image,
  ProductContainer,
  ProductDetail,
  Separator,
} from "./style";

interface MenuProps {
  onAddToCart: (product: Product) => void;
  products: Product[];
}

export function Menu({ onAddToCart, products }: MenuProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null);

  function handleSelectProduct(product: Product) {
    setIsModalVisible(true);
    setSelectedProduct(product);
  }

  return (
    <>
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />

      <FlatList
        data={products}
        style={{ marginTop: 32 }}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        keyExtractor={(product) => product._id}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item: product }) => (
          <ProductContainer onPress={() => handleSelectProduct(product)}>
            <Image
              source={{
                uri: `http://192.168.1.29/uploads/${product.imagePath}`,
              }}
            />

            <ProductDetail>
              <Text weight="500">{product.name}</Text>
              <Text size={14} color="#666" style={{ marginVertical: 8 }}>
                {product.description}
              </Text>
              <Text size={14} weight="500">
                {formatCurrency(product.price)}
              </Text>
            </ProductDetail>
            <AddToCartButton onPress={() => onAddToCart(product)}>
              <PlusCircle />
            </AddToCartButton>
          </ProductContainer>
        )}
      />
    </>
  );
}
