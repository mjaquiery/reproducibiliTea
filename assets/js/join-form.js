/**
 Functions for operating the join form page
 */

/**
 * Add a new organiser field below the current latest one
 * @param e {Event} button click event
 * @return {boolean}
 */
function addNewOrganiser(e) {
    const lastOrganiser = document.querySelector('#newJC .JC-organisers .organisers input:last-of-type');

    let id = -1;

    if(lastOrganiser.name !== 'lead') {
        // Find the ID of the latest organiser
        const regex = /helper([0-9]+)/.exec(lastOrganiser.id);
        if(regex[1])
            id = parseInt(regex[1]);
    }

    let newOrganiser = document.createElement('input');
    newOrganiser.type = 'text';
    newOrganiser.classList.add('optional');
    newOrganiser.id = 'helper' + (id + 1);
    newOrganiser.name = newOrganiser.id;
    newOrganiser.placeholder = 'Helper #' + (id + 2);

    lastOrganiser.parentElement.insertBefore(newOrganiser, lastOrganiser.nextSibling);

    // no submit action
    e.preventDefault();
    return false;
}

/**
 * Check form and update visuals for failed areas
 * @param form {Element} form to check
 * @return {boolean}
 */
function checkForm(form) {
    let okay = true;

    // Clean existing failures
    form.querySelectorAll('.bad').forEach(e => e.classList.remove('bad'));

    form.querySelectorAll('.mandatory input, .mandatory textarea')
        .forEach(e => {
            if(!e.value && !e.classList.contains('optional')) {
                okay = false;
                e.classList.add('bad');
            }
    });

    return okay;
}

/**
 * Check and submit form, then fill in the response from the server
 * @param e {Event} button click event
 * @return {boolean}
 */
async function submitForm(e) {
    // no submit action
    e.preventDefault();

    const form = document.querySelector('#newJC');

    // Fill in form defaults for debugging
    document.querySelector('#jcid').value = 'academia';
    document.querySelector('#name').value = 'academia';
    document.querySelector('#uni').value = 'Academia University';
    document.querySelector('#uniWWW').value = 'https://academia.ac/';
    document.querySelector('#email').value = 'osNerd@academia.ac';
    document.querySelector('#post').value = 'Room 42, Ivory Tower, Academia University, Brainland';
    document.querySelector('#lead').value = 'Dr Nerd';
    document.querySelector('#authCode').value = 'rpt-NewJC';

    const formData = new FormData(form);

    // Check form
    // if(!checkForm(form))
    //     return false;

    // Show pending status
    form.style.maxHeight = getComputedStyle(form).height;
    setTimeout(() => form.classList.add('cloak'), 0);

    const elm = document.createElement('div');
    elm.id = 'response';
    elm.innerHTML = '<div class="icon"><i class="fas fa-mug-hot fa-spin"></i></div>';

    document.querySelector('main .wrapper').appendChild(elm);

    // Send off to php handler and fill in response
    try {
        const response = await fetch('/src/newJC.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log('Success:', JSON.stringify(result));
    } catch (error) {
        console.error('Error:', error);
    }
}