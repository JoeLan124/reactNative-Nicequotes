import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Button, StyleSheet, View, Platform, SafeAreaView } from 'react-native';
import Quote from './JS/components/Quote';
import NewQuote from './JS/components/NewQuote';
import AsyncStorage from '@react-native-community/async-storage';


const data = [

  { text: "Zitat 1 jhgjhghgjhgjhgjhghj", author: "Author1" },
  { text: "Zitat 2 sdjhfkshsdfkjhsdfkj", author: "Author2" },
  { text: "Zitat 3 skdjhfkjhshdfkjshkj", author: "Author3" },

];

export default class App extends Component {

  state = { index: 0, showNewQuoteScreen: false, quotes: data };

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



    this.setState({ showNewQuoteScreen: false, quotes });

  };

  componentDidMount() {
    this._retrieveData();
  }

  render() {
    let { index, quotes } = this.state;
    const quote = quotes[index];
    let nextIndex = index + 1;
    if (nextIndex === quotes.length) nextIndex = 0;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonNew}>
          <Button
            title="Neu"
            onPress={() => this.setState({ showNewQuoteScreen: true })}
          />
        </View>

        <NewQuote
          visible={this.state.showNewQuoteScreen}
          onSave={this._addQuote}
        />

        <Quote text={quote.text} author={quote.author} />

        <View style={styles.buttonNext}>
          <Button
            title="Nächstes Zitat"
            onPress={() => this.setState({ index: nextIndex })} />
        </View>
      </SafeAreaView>
    );
  }



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
    bottom: Platform.OS === 'ios' ? 20 : 30,
  },

  buttonNew: {
    position: 'absolute',
    right: 30,
    top: 50,
  }

}
);
