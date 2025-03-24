import { Modal } from "react-native";
import { CheckCircle } from "../../Icons/CheckCircle";
import { Text } from "../text";
import { Container, OKButton } from "./style";

interface OrderConfirmModalProps {
  visible: boolean;
  onOk: () => void;
}

export function OrderConfirmModal({ visible, onOk }: OrderConfirmModalProps) {
  return (
    <>
      <Modal visible={visible} animationType="fade">
        <Container>
          <CheckCircle />
          <Text size={20} weight="500" color="#fff" style={{ marginTop: 12 }}>
            Pedido confirmado
          </Text>
          <Text color="#fff" opacity={0.9} style={{ marginTop: 4 }}>
            o pedido já entrou na fila de produção
          </Text>

          <OKButton onPress={onOk}>
            <Text color="#d73035" weight="500">
              OK
            </Text>
          </OKButton>
        </Container>
      </Modal>
    </>
  );
}
