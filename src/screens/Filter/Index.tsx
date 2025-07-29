import { View, Text } from "react-native";
import Header from "~/src/layout/Header";
import Input from "./Input";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Service from "./Components/Service";

export default function Filter() {
  const [menu, setMenu] = useState<string>("default");

  useEffect(() => {
    console.log(menu);
  }, [menu]);

  return (
    <View className="h-full bg-white">
      {menu == "default" ? (
        <>
          <Header title="Filtro" leftIcon={"back"} />
          <ScrollView className="gap-5">
            <View>
              <Input
                title={"Serviço"}
                placeholder={"Escolha uma opção"}
                visible={menu}
                setVisible={setMenu}
              />
            </View>
            <View>
              <Input
                title={"Horário"}
                placeholder={"teste"}
                visible={menu}
                setVisible={setMenu}
              />
            </View>
            <View>
              <Input
                title={"Pagamento"}
                placeholder={"teste"}
                visible={menu}
                setVisible={setMenu}
              />
            </View>
            <View>
              <Input
                title={"Contrato"}
                placeholder={"teste"}
                visible={menu}
                setVisible={setMenu}
              />
            </View>
            <View>
              <Input
                title={"Modalidade"}
                placeholder={"teste"}
                visible={menu}
                setVisible={setMenu}
              />
            </View>
            <View>
              <Input
                title={"Mobilidade"}
                placeholder={"teste"}
                visible={menu}
                setVisible={setMenu}
              />
            </View>
          </ScrollView>
        </>
      ) : menu == "service" ? (
        <>
          <Service />
        </>
      ) : (
        ""
      )}
    </View>
  );
}
