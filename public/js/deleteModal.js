// Este script se encarga de manejar la lógica del modal de confirmación de eliminación.

const modal =
    document.getElementById(
        'delete-modal'
    );

const confirmBtn =
    document.getElementById(
        'confirm-delete'
    );

const cancelBtn =
    document.getElementById(
        'cancel-delete'
    );

let currentForm = null;

document
    .querySelectorAll('.table-actions .btn-delete')
    .forEach(button => {

        button.addEventListener(
            'click',
            (event) => {
                
                event.preventDefault();

                currentForm =
                    button.closest('form');

                modal.classList.remove(
                    'hidden'
                );
            }
        );
    });

cancelBtn.addEventListener(
    'click',
    () => {
        modal.classList.add(
            'hidden'
        );
    }
);

confirmBtn.addEventListener(
    'click',
    () => {
        currentForm.submit();
    }
);