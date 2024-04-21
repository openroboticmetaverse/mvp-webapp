<template>
    <base-panel :position="'right'">
        <template v-slot:panel>
            <div class="mb-auto m-2 rounded">
                <div class="text-white p-4 font-bold uppercase text-left text-sm tracking-wide">Debug</div>
                <base-card>
                    orem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget tellus blandit, mollis erat
                    commodo, iaculis nisi. Fusce nisi justo, bibendum non purus id, semper fringilla orci. Proin
                    condimentum ullamcorper odio fringilla accumsan. Nullam feugiat id eros vel pharetra. Pellentesque
                    habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed pulvinar, nulla
                    nec lobortis mattis, arcu risus finibus libero, ut blandit augue nulla at ligula. Suspendisse
                    ultrices justo quis pellentesque blandit. Ut ut finibus odio, ullamcorper ultricies ligula. Vivamus
                    quis magna id diam laoreet convallis. Fusce ornare malesuada turpis a convallis. Phasellus aliquet
                    rutrum orci. Vestibulum facilisis sem vitae velit imperdiet, pharetra dignissim lacus auctor.
                    Praesent tincidunt augue in velit tempus, in fringilla quam lacinia. Nunc a tellus et ipsum aliquet
                    rhoncus nec vel elit. Vestibulum et rutrum nulla, in finibus ante.

                    Fusce posuere sodales diam non commodo. Integer fringilla, erat eu semper consequat, urna diam
                    auctor massa, sed finibus orci odio at lectus. Morbi et lacus non nibh volutpat varius. Sed quis
                    tincidunt dolor. Sed eu cursus risus. Etiam pharetra ligula orci. Sed sit amet dignissim ex.
                    Curabitur sed ultrices nibh. Praesent venenatis consectetur accumsan. Proin faucibus placerat risus
                    sed ullamcorper. Ut eu eros risus. Donec porttitor risus a scelerisque ultrices. Morbi enim sem,
                    congue vel urna et, iaculis luctus arcu. Etiam condimentum quis ipsum tincidunt bibendum.
                </base-card>
            </div>



        </template>

    </base-panel>
</template>

<script setup lang="ts">
import BasePanel from '../ui/BasePanel.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseCard from '../ui/BaseCard.vue';

</script>
