import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Alert, Button, StyleSheet, View, Platform, SafeAreaView, Text } from 'react-native';

// TODO firebase import
import Firebase from './JS/Firebase';
import Quote from './JS/components/Quote';
import NewQuote from './JS/components/NewQuote';


export default class App extends Component {

  state = { index: 0, showNewQuoteScreen: false, quotes: [] };

  _retrieveData = async () => {
    // TODO Daten aus firebase laden
    let quotes = [];
    let query = await Firebase.db.collection('quotes').get();
    query.forEach(quote => {
      quotes.push({
        id: quote.id,
        text: quote.data().text,
        author: quote.data().author
      });
    });
    this.setState({ quotes });
  }

  _saveQuotetoDB = async (text, author, quotes) => {
    // TODO Daten in Firebase speichern
    docRef = await Firebase.db.collection('quotes').add({ text, author });
    quotes[quotes.length - 1].id = docRef.id;
  }

  _removeQuoteFromDB(id) {
    // TODO Daten in Firebase löschen
    Firebase.db
      .collection('quotes')
      .doc(id)
      .delete();
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
    // TODO firebase initialisieren
    Firebase.init();
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
