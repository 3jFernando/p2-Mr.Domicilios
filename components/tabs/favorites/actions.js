import Axios from 'axios';
import {URL_API} from '../../utils/api-url';

import {showToast} from '../../utils/toast-android';

export async function addToFavorite(client_id, type, entity_id) {
  await Axios.post(URL_API + '/favorites/client', {
    client_id,
    type,
    entity_id,
  })
    .then(response => {
      if (response.data.status === 200) {
        if (response.data.action) {
          showToast('Favorito agregado');
        } else {
          showToast('Favorito eliminado');
        }
      }
    })
    .catch(e => showToast('Ocurrio un error al tratar de realizar la accion.'))
    .finally(() => {});
}
