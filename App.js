import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Alert, Button, StyleSheet, View, Platform, SafeAreaView, Text } from 'react-native';
import Quote from './JS/components/Quote';
import NewQuote from './JS/components/NewQuote';
import AsyncStorage from '@react-native-community/async-storage';




export default class App extends Component {

  state = { index: 0, showNewQuoteScreen: false, quotes: [] };

  _storeData(quotes) {
    AsyncStorage.setItem('QUOTES', JSON.stringify(quotes));
  }

  _retrieveData = async () => {
    /*     AsyncStorage.getItem('QUOTES').then(value => {
          if (value !== null) {
            value = JSON.parse(value)
            this.setState({ quotes: value });
          }
        }); */

    let value = await AsyncStorage.getItem('QUOTES');
    if (value !== null) {
      value = JSON.parse(value)
      this.setState({ quotes: value });
    }
  };

  _addQuote = (text, author) => {

    let { quotes } = this.state;
    if (text && author) {
      quotes.push({ text, author });
      this._storeData(quotes);
    }
    this.setState({ index: quotes.length - 1, showNewQuoteScreen: false, quotes });
  };
  _deleteButton() {
    Alert.alert('Zitat löschen', 'Soll das Zitat gelöscht werden?', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () => this._deleteQuote() }
    ]);
  }

  _deleteQuote() {
    let { index, quotes } = this.state;
    quotes.splice(index, 1);
    this._storeData(quotes);
    this.setState({ index: 0, quotes });
  }

  _displayNextQuote() {
    let { index, quotes } = this.state;
    let nextIndex = index + 1;
    if (nextIndex === quotes.length) nextIndex = 0;
    this.setState({ index: nextIndex });
  }

  componentDidMount() {
    this._retrieveData();
  }

  render() {
    let { index, quotes } = this.state;
    const quote = quotes[index];
    let content = <Text style={{ fontSize: 36 }}>Keine Zitate</Text>;

    if (quote) {
      content = <Quote text={quote.text} author={quote.author} />;
    }
    return (
      <SafeAreaView style={styles.container} >

        <StyledButton
          style={styles.buttonNew}
          visible={true}
          title="Neu"
          onPress={() => this.setState({ showNewQuoteScreen: true })}
        />

        <StyledButton
          style={styles.buttonNext}
          visible={quotes.length >= 2}

          title="Nächstes Zitat"
          onPress={() => this._displayNextQuote()}
        />

        <StyledButton
          style={styles.buttonDelete}
          visible={quotes.length >= 1}

          title="Löschen"
          onPress={() => this._deleteButton()}
        />

        <NewQuote
          visible={this.state.showNewQuoteScreen}
          onSave={this._addQuote}
        />
        { content}
      </SafeAreaView>
    );
  }


}

function StyledButton(props) {
  let button = null;
  if (props.visible)
    button = (
      <View style={props.style}>
        <Button
          title={props.title}
          onPress={props.onPress}
        />
      </View>
    );
  return button;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },

  buttonNext: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 30
  },

  buttonNew: {
    position: 'absolute',
    right: 30,
    top: 50
  },
  buttonDelete: {
    position: 'absolute',
    left: 30,
    top: 50
  }

}
);
