
import './HowToUseWebsite.css'

function HowToUseWebsite() {


    return (
        <div className="how-to-use-container">
            <h3 className='how-to-use-title'>How to use website</h3>
            <ol className="how-to-use-olist">
                <li><strong>Define Your Decision</strong>
                    <p>Enter the subject you want to decide on in the Table Name field (e.g., New PC).</p>
                </li>

                <li><strong>Set Your Criteria</strong>
                    <p>Add the factors that matter to you and assign each a weighted rating.</p>
                    <p>Example: If budget is very important, you might give it a weight of 7.</p>
                </li>

                <li><strong>Rate Your Options</strong>
                    <p>In the Rate Your Options Table, list all possible candidates and evaluate them according to your criteria.</p>
                    <p>Example: If budget is a factor, you might rate options based on their cost high cost being lower and vice versa.</p>
                </li>

                <li><strong>Submit Your Data</strong>
                    <p>Once you’ve entered all your ratings, click the Submit button located at the bottom-right corner of the page to finalize your decision.</p>
                </li>
            </ol>
            
            <h4 className='how-to-use-weighted'>Weighted decision-making is a method of scoring options and finding the best possible outcome by shifting the weight of importance as quickly as possible.</h4>

        </div>
    )
}

export default HowToUseWebsite