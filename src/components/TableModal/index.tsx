import { useState } from "react";
import { Modal, Platform, TouchableOpacity } from "react-native";
import { Close } from "../../Icons/Close";
import { Button } from "../Button";
import { Text } from "../text";
import { Form, Header, Input, ModalBody, OverLay } from "./styled";

interface TableModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (table: string) => void;
}

export function TableModal({ visible, onClose, onSave }: TableModalProps) {
  const [table, settable] = useState("");

  function handleTable() {
    settable("");
    onSave(table);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <OverLay behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ModalBody>
          <Header>
            <Text weight="500">Informe a mesa</Text>
            <TouchableOpacity onPress={onClose}>
              <Close color="#666" />
            </TouchableOpacity>
          </Header>
          <Form>
            <Input
              placeholder="Numero da mesa"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              onChangeText={settable}
            />
            <Button onPress={handleTable} disabled={table.length === 0}>
              Confirmar
            </Button>
          </Form>
        </ModalBody>
      </OverLay>
    </Modal>
  );
}
