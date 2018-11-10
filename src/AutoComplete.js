import React, {Component} from 'react';
import data from './MOCK_DATA';

class AutoComplete extends Component {

    constructor() {
        super();

        this.state = {
            searchResults: null,
            inputValue: ''
        }
    }

    sortResults(inputValue, result1, result2) {
        inputValue = inputValue.split('');
        let r1FirstName = result1.first_name.toLowerCase().split('');
        let r2FirstName = result2.first_name.toLowerCase().split('');

        let r1Count = 0;
        let r2Count = 0;

        let hasMatch = true;

        for (let i = 0; i < inputValue.length; i++) {
            let match = false;

            if (!hasMatch) break;

            if (inputValue[i] === r1FirstName[i]) {
                r1Count += 1;
                match = true;
            }

            if (inputValue[i] === r2FirstName[i]) {
                r2Count += 1;
                match = true;
            }

            if (!match) hasMatch = false;

        }

        if (r1Count > r2Count) return -1;

        if (r1Count < r2Count) return 1;

        if (r1Count === r2Count) return 0;
    }

    sortSearchResultData = (e) => {
        const inputValue = e.target.value;

        if (!inputValue) {
            this.setState({
                searchResults: null,
                inputValue
            });
            return;
        }

        const inputValueToSearch = inputValue.toLowerCase();

        let primaryResults = [];
        let secondaryResults = [];

        data.forEach(search => {

            let hasResult = false;

            if (search.first_name.toLowerCase().includes(inputValueToSearch)) {
                primaryResults = [...primaryResults, search];
                hasResult = true;
            }

            if (!hasResult && search.last_name.toLowerCase().includes(inputValueToSearch)) {
                secondaryResults = [...secondaryResults, search];
            }

        });

        primaryResults.sort(this.sortResults.bind(this, inputValueToSearch));
        const searchResults = [...primaryResults, ...secondaryResults];

        this.setState({searchResults, inputValue});
    }

    selectSearchValue = (event) => {
        this.setState({
            searchResults: null,
            inputValue: event.target.innerText
        });
    }

    searchResultMouseEnter = (event) => {
        event.target.parentNode.style.background = 'lightblue';
    }

    searchResultMouseLeave = (event) => {
        event.target.parentNode.style.background = '';
    }

    render() {

        const {searchResults, inputValue} = this.state;

        return (
            <div className="AutoComplete">
                <input onChange={this.sortSearchResultData} value={inputValue}/>
                {

                    searchResults
                        ? searchResults.map(({id, first_name, last_name}) => {

                            const displayText = `${first_name} ${last_name}`;
                            const position = displayText.toLowerCase().indexOf(inputValue.toLowerCase());

                            let start = displayText.slice(0, position);
                            let highlight = displayText.slice(position, (position + inputValue.length));
                            let end = displayText.slice(position + inputValue.length);

                            return <div
                                style={{marginBottom: 10}}
                                key={id}
                                onClick={this.selectSearchValue}
                                onMouseEnter={this.searchResultMouseEnter}
                                onMouseLeave={this.searchResultMouseLeave}>
                                <p style={{fontWeigh: 'bold'}}>
                                    {start}
                                    <span style={{color: 'coral'}}>{highlight}</span>
                                    {end}
                                </p>
                            </div>
                        })
                        : null
                }
            </div>
        );
    }
}

export default AutoComplete;
