## Testing


### Browser Compatibility

I tested the website on four different operating systems on four different types of hardware.

<!-- 
| Operating System | Chrome | Firefox | Edge | Safari |
|------------------|--------|---------|------|--------|
| macOS 12.2       | ✅      | ✅       | ✅    | ✅      |
| Windows 10       | ✅      | ✅       | ✅    | ✅    |
| Android 10       | ✅      | ✅       | ✅    | ✅      |
| iOS & iPadOS 15  | ✅     | ✅       | ✅    | ✅      | -->


🔸 All iOS browsers use WebKit for rendering so perform same as Safari)

#### Testing Favicon on all Browsers



### Accessibility

<!-- - No errors were detected using the [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/report#/https://www.davidindub.com/fizzbuzz/). -->


[![WAVE Web Accessibility Evaluation Tool](/documentation/images/testing/testing-wave-accessibility.png)](https://wave.webaim.org/report#/https://www.davidindub.com/fizzbuzz/)


### Code Validation

- HTML

  - No errors were returned when passing through the official [W3C validator](https://validator.w3.org/nu/?doc=https%3A%2F%2Fwww.davidindub.com%2Fplant-cafe%2F).


- CSS

  - No errors were found when passing through the official [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fwww.davidindub.com%2Fplant-cafe%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en).

    [![](https://jigsaw.w3.org/css-validator/images/vcss)](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fwww.davidindub.com%2Fplant-cafe%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)

***

### Responsiveness

I tested for responsiveness on many different sized viewports from 320px wide up to Ultrawide resolutions, and using different hardware (Monitors, Laptops, Phones).
  
***
    
### Performance

The project was tested for performance on Mobile and Desktop using [Google Lighthouse](https://developers.google.com/web/tools/lighthouse).

#### Mobile Lighthouse Scores

| **Page** | **Performance** | **Accessibility** | **Best Practices** | **SEO** |
|----------|-----------------|-------------------|--------------------|---------|
| Landing  | 99              | 90               | 100                | 100      |

#### Desktop Lighthouse Scores

| **Page** | **Performance** | **Accessibility** | **Best Practices** | **SEO** |
|----------|-----------------|-------------------|--------------------|---------|
| Landing  | 100              | 90               | 100                | 100     |

***

### User Story Tests

- As a parent, I want a simple friendly game so my child can practice division.

![](documentation/images/testing/testing-user-story-1.gif)


- As a maths enthusiast, I want a more difficult game to challenge myself.

![](documentation/images/testing/testing-user-story-2.gif)

- I want to be able to share my high score with a friend

![](documentation/images/testing/testing-user-story-3.gif)

- I want to be able to play the game with my keyboard instead of clicking

![](documentation/images/testing/testing-user-story-4.gif)

- As I use dark mode user, I want the game to recognise my preference.

![](documentation/images/testing/testing-user-story-5.gif)


***

### Bugs

![](documentation/images/testing/testing-safari-bug-2.jpeg)![](documentation/images/testing/testing-safari-bug-1.jpeg)

When using Safari, certain `border-radius` styles causes a grey box to appear inside some elements, and thereford I couldn't use the wavey border style on certain elements. Unpredictable clipping and issues with border-radius seem to be a [known issue](https://www.google.com/search?q=safari+border-radius+short-hand) with Safari/WebKit.



### Unfixed Bugs

