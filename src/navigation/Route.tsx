import React from 'react';
import { ThemeContextProvider } from '../constants/ThemeContext';
import StackNavigator from './StackNavigator';
import { CollaboratorProvider } from '../context/CollaboratorContext';
import ValidateCollaboratorAndBlock from '../screens/utils/validateCollaboratorAndBlock';
import { Text, View } from 'react-native';
const Route = () => {

	return (
		<ThemeContextProvider>
			<CollaboratorProvider>
				{/* <ValidateCollaboratorAndBlock/> */}
				<StackNavigator/>

			</CollaboratorProvider>
		</ThemeContextProvider>
	)
}


export default Route;