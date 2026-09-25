import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { normalizeListingInput } from './listings';

describe('normalizeListingInput', () => {
  it('keeps valid listing values and normalizes derived fields', () => {
    const listing = normalizeListingInput({
      title: '  Used laptop  ',
      category: 'electronics',
      price: '2500',
      isNegotiable: 'true',
      universityId: 'ug-legon',
      universityName: 'University of Ghana (UG)',
      location: 'Pentagon Hall',
      meetupSpot: 'Balme Library',
      description: 'This is a short description with five words here.',
      condition: 'good',
      images: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
      sellerName: 'Ada',
      sellerPhone: '0241234567',
      sellerWhatsappNumber: '233241234567',
      sellerUniversity: 'University of Ghana (UG)',
      sellerHostelOrHall: 'Pentagon Hall',
      sellerRoomOrSpot: 'Room 2',
      sellerStudentIdVerified: true,
      sellerAvatarUrl: 'https://example.com/avatar.jpg',
    });

    assert.equal(listing.title, 'Used laptop');
    assert.equal(listing.price, 2500);
    assert.equal(listing.isNegotiable, true);
    assert.equal(listing.wordCount, 9);
    assert.equal(listing.images.length, 2);
    assert.equal(listing.seller.name, 'Ada');
    assert.equal(listing.seller.whatsappNumber, '233241234567');
  });
});
