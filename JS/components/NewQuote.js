import React, { Component } from 'react';
import { View, StyleSheet, Modal, Button, TextInput, Text } from 'react-native';


export default class NewQuote extends Component {

    state = { content: null, author: null };

    render() {
        const { visible, onSave } = this.props;
        const { content, author } = this.state;

        return (
            <Modal
                visible={visible}
                onRequestClose={() => {
                    onSave(null, null);

                }}
                animationType="slide"
            >

                <View style={styles.container}>
                    <TextInput
                        style={[styles.input, { height: 150 }]}
                        placeholder="Inhalt des Zitats: "
                        underlineColorAndroid="transparent"
                        multiline={true}
                        onChangeText={text => this.setState({ content: text })}

                    />
                    {/*   <Text>{this.state.content}</Text>
                    <Text>{this.state.author}</Text> */}

                    <TextInput
                        style={styles.input}
                        placeholder="Autor des Zitats: "
                        underlineColorAndroid="transparent"
                        onChangeText={text => this.setState({ author: text })}

                    />
                    <Button title="Speichern" onPress={() => {
                        this.setState({ content: null, author: null });
                        onSave(content, author);
                    }}
                    />
                </View>
            </Modal>
        );
    }
}


const styles = StyleSheet.create({


    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40
    },

    input: {
        borderWidth: 1,
        borderColor: 'deepskyblue',
        borderRadius: 4,
        width: '80%',
        marginBottom: 20,
        fontSize: 20,
        padding: 10,
        height: 50

    }

}
);