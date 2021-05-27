import React from 'react'

function header({approvers, quorum}) {
    return(
    <div>
        <ul>
            <li>
            <ul>
            Approvers : {approvers.map( approver => (
                <li>{approver}</li>))}
            </ul>
            </li>
            <li>
                Quorum : {quorum}
            </li>
        </ul>
    </div>
    );
}

export default header;