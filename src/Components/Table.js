import React from "react";
import "./Table.css";
import numeral from "numeral";
function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(({ country, cases }) => {
            return (
              <tr key={country}>
                <td>{country}</td>
                <td>{numeral(cases).format()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
