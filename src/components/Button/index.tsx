import { ActivityIndicator } from "react-native";
import { Text } from "../text";
import { Container } from "./style";

interface ButtonProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ children, onPress, disabled, loading }: ButtonProps) {
  return (
    <>
      <Container onPress={onPress} disabled={disabled || loading}>
        <Text weight="600" color="#FFF">
          {!loading && (
            <Text weight="600" color="#fff">
              {children}
            </Text>
          )}

          {loading && <ActivityIndicator color="#fff" />}
        </Text>
      </Container>
    </>
  );
}
