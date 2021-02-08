import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Alert, Button, StyleSheet, View, Platform, SafeAreaView, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

import Quote from './JS/components/Quote';
import NewQuote from './JS/components/NewQuote';

const database = SQLite.openDatabase('quotes.db');

export default class App extends Component {

  state = { index: 0, showNewQuoteScreen: false, quotes: [] };




  _retrieveData() {
    database.transaction((transaction) =>
      transaction.executeSql(
        'SELECT * FROM quotes',
        [],
        (_, result) => this.setState({ quotes: result.rows._array })
      )
    );
  }

  _saveQuotetoDB(text, author, quotes) {
    database.transaction((transaction) =>
      transaction.executeSql(
        'INSERT INTO quotes (text,author) VALUES (?,?)',
        [text, author],
        (_, result) =>
          (quotes[quotes.length - 1].id = result.insertId)
      )
    );

  }

  _removeQuoteFromDB(id) {
    database.transaction(transaction =>
      transaction.executeSql('DELETE FROM quotes WHERE id = ?', [id])
    );
  }



  _addQuote = (text, author) => {
    // neues Zitat in die Datenbank eintragen
    let { quotes } = this.state;
    if (text && author) {
      quotes.push({ text, author });
      this._saveQuotetoDB(text, author, quotes);

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
    // TOTO: Zitat aus der Datenbank löschen
    let { index, quotes } = this.state;
    this._removeQuoteFromDB(quotes[index].id);
    quotes.splice(index, 1);
    this.setState({ index: 0, quotes });
  }

  _displayNextQuote() {
    let { index, quotes } = this.state;
    let nextIndex = index + 1;
    if (nextIndex === quotes.length) nextIndex = 0;
    this.setState({ index: nextIndex });
  }

  componentDidMount() {
    database.transaction(
      (transaction) => transaction.executeSql('CREATE TABLE IF NOT EXISTS quotes(id INTEGER PRIMARY KEY NOT NULL, text Text, author TEXT)'
      )
    );
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
