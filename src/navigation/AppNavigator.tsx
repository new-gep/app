import DismissalHome from '../screens/Work/Dismissal/DismissalHome';

// ... código existente ...
<Stack.Navigator>
  {/* ... outras rotas ... */}
  <Stack.Screen 
    name="DismissalHome" 
    component={DismissalHome}
    options={{
      title: 'Solicitação de Demissão'
    }}
  />
</Stack.Navigator> 