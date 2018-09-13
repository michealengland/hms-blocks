import './i18n.js';

/**
 * Import Blocks index.js
 * BUG: When using templates on save will cause content loss if template has been modified in editor.
 * INNER BLOCKS BREAK OTHER BLOCKS
 */

import './innerblocks';                       // Inner Blocks Single Column w/ Color Panel
import './innerblocks-cta';                   // Inner Blocks Single Column w/ Color Panel, Heading, Paragraph, Button
import './innerblocks-cover-image';           // Inner Blocks Cover Image w/ Color Panel
//import './innerblocks-cover-image-template';  // Inner Blocks Cover Image w/ Color Panel, Heading, Paragraph
import './image-tile';                        // Simple block that uses Image / Header / Paragraph
// WIP import './link-tile';                        // Simple block that uses Image / Header / Paragraph
import './toggle-block';                      // Toggle Block w/ Heading & Inner Block
import './offset-columns';                    // Inner Blocks Columns 2-3 Range w/ Toggle Control
//import './flexslider';                        // Custom Flex Slider. SCRIPTS ARE LOADED IN CHILD THEME... NEED BETTER SOLUTION
